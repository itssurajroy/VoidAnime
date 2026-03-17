import 'server-only';
import { db } from '@/lib/firebase-admin';
import type { ReportWithReporter } from '@/types/moderation';
import type { ReportStatus } from '@/types/db';

interface GetReportsFilters {
  status?: ReportStatus;
  category?: string;
  targetType?: string;
  page?: number;
  limit?: number;
}

export async function getReports(filters: GetReportsFilters): Promise<{ reports: ReportWithReporter[], total: number, totalPages: number }> {
  const { status, page = 1, limit = 20 } = filters;

  if (!db) {
    return { reports: [], total: 0, totalPages: 0 };
  }

  try {
    let query: any = db.collection('reports');
    
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    const countQuery = status 
      ? await db.collection('reports').where('status', '==', status).count().get()
      : await db.collection('reports').count().get();

    const total = countQuery.data().count || 0;
    const totalPages = Math.ceil(total / limit);

    const reports: ReportWithReporter[] = await Promise.all(snapshot.docs.map(async (doc: any) => {
      const data = doc.data();
      
      let reporter = null;
      if (data.reporterId && db) {
        try {
          const userDoc = await db.collection('users').doc(data.reporterId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            reporter = {
              id: data.reporterId,
              name: userData?.name || 'Unknown',
              email: userData?.email || '',
            };
          }
        } catch (e) {
          console.error('Error fetching reporter:', e);
        }
      }

      return {
        id: doc.id,
        reporterId: data.reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        category: data.category,
        reasonText: data.reasonText,
        status: data.status,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        handledByUserId: data.handledByUserId,
        resolutionAction: data.resolutionAction,
        resolutionNote: data.resolutionNote,
        resolvedAt: data.resolvedAt,
        reporter,
      };
    }));

    return { reports, total, totalPages };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { reports: [], total: 0, totalPages: 0 };
  }
}

export async function getReportById(reportId: string): Promise<ReportWithReporter | null> {
  if (!db) return null;

  try {
    const doc = await db.collection('reports').doc(reportId).get();
    if (!doc.exists) return null;

    const data = doc.data();
    
    let reporter = null;
    if (data?.reporterId) {
      try {
        const userDoc = await db.collection('users').doc(data.reporterId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          reporter = {
            id: data.reporterId,
            name: userData?.name || 'Unknown',
            email: userData?.email || '',
          };
        }
      } catch (e) {
        console.error('Error fetching reporter:', e);
      }
    }

    return {
      id: doc.id,
      ...data,
      reporter,
      createdAt: data?.createdAt?.toDate?.() || new Date(),
      updatedAt: data?.updatedAt?.toDate?.() || new Date(),
    } as ReportWithReporter;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}
