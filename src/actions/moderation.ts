'use server';

import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { ReportStatus, ReportCategory, ReportTargetType, Report, Comment, User } from '@/types/db';

export async function getReports(
  status?: ReportStatus,
  page: number = 1,
  limit: number = 20
): Promise<{ reports: Report[]; total: number; totalPages: number }> {
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

    const reports = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      } as Report;
    });

    return { reports, total, totalPages };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { reports: [], total: 0, totalPages: 0 };
  }
}

export async function resolveReport(
  reportId: string,
  action: 'RESOLVED' | 'DISMISSED',
  resolutionNote?: string,
  adminId?: string
) {
  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const reportRef = db.collection('reports').doc(reportId);
    
    await reportRef.update({
      status: action,
      resolutionNote: resolutionNote || null,
      resolvedAt: new Date().toISOString(),
      handledByUserId: adminId || 'admin',
      updatedAt: new Date().toISOString(),
    });

    revalidatePath('/admin/moderation');
    return { success: true };
  } catch (error) {
    console.error('Error resolving report:', error);
    return { success: false, error: 'Failed to resolve report' };
  }
}

export async function banUser(
  userId: string,
  reasonCategory: ReportCategory,
  reasonText: string,
  durationDays?: number,
  adminId?: string
) {
  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const banRef = db.collection('bannedUsers').doc(userId);

    const banData = {
      userId,
      bannedByUserId: adminId || 'admin',
      reasonCategory,
      reasonText,
      endsAt: durationDays 
        ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
        : null,
      createdAt: new Date().toISOString(),
    };

    await banRef.set(banData);

    await userRef.update({
      status: 'BANNED',
      bannedAt: new Date().toISOString(),
      banReason: reasonText,
    });

    revalidatePath('/admin/moderation');
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error banning user:', error);
    return { success: false, error: 'Failed to ban user' };
  }
}

export async function unbanUser(userId: string) {
  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const banRef = db.collection('bannedUsers').doc(userId);

    await banRef.delete();

    await userRef.update({
      status: 'ACTIVE',
      bannedAt: null,
      banReason: null,
    });

    revalidatePath('/admin/moderation');
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error unbanning user:', error);
    return { success: false, error: 'Failed to unban user' };
  }
}

export async function hideComment(commentId: string, reason?: string) {
  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const commentRef = db.collection('comments').doc(commentId);
    
    await commentRef.update({
      isHidden: true,
      hiddenReason: reason || 'Hidden by moderator',
      hiddenAt: new Date().toISOString(),
    });

    revalidatePath('/admin/moderation');
    return { success: true };
  } catch (error) {
    console.error('Error hiding comment:', error);
    return { success: false, error: 'Failed to hide comment' };
  }
}

export async function deleteComment(commentId: string) {
  if (!db) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const commentRef = db.collection('comments').doc(commentId);
    await commentRef.delete();

    revalidatePath('/admin/moderation');
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: 'Failed to delete comment' };
  }
}

export async function getFlaggedComments(
  page: number = 1,
  limit: number = 20
): Promise<{ comments: (Comment & { hiddenReason?: string; hiddenAt?: string })[]; total: number; totalPages: number }> {
  if (!db) {
    return { comments: [], total: 0, totalPages: 0 };
  }

  try {
    const snapshot = await db.collection('comments')
      .where('isHidden', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    const countSnapshot = await db.collection('comments')
      .where('isHidden', '==', true)
      .count()
      .get();

    const total = countSnapshot.data().count || 0;
    const totalPages = Math.ceil(total / limit);

    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    } as Comment & { hiddenReason?: string; hiddenAt?: string }));

    return { comments, total, totalPages };
  } catch (error) {
    console.error('Error fetching flagged comments:', error);
    return { comments: [], total: 0, totalPages: 0 };
  }
}

export async function getBannedUsers(
  page: number = 1,
  limit: number = 20
): Promise<{ users: any[]; total: number; totalPages: number }> {
  if (!db) {
    return { users: [], total: 0, totalPages: 0 };
  }

  try {
    const snapshot = await db.collection('bannedUsers')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    const countSnapshot = await db.collection('bannedUsers').count().get();
    const total = countSnapshot.data().count || 0;
    const totalPages = Math.ceil(total / limit);

    const users = await Promise.all(snapshot.docs.map(async (doc) => {
      const banData = doc.data();
      let userData: User | null = null;
      
      try {
        if (db) {
          const userDoc = await db.collection('users').doc(banData.userId).get();
          userData = userDoc.exists ? userDoc.data() as User : null;
        }
      } catch (e) {
        console.error('Error fetching user data:', e);
      }

      return {
        id: doc.id,
        ...banData,
        user: userData,
        createdAt: banData.createdAt?.toDate?.() || banData.createdAt,
        endsAt: banData.endsAt,
      };
    }));

    return { users, total, totalPages };
  } catch (error) {
    console.error('Error fetching banned users:', error);
    return { users: [], total: 0, totalPages: 0 };
  }
}

export async function getReportById(reportId: string) {
  if (!db) return null;

  try {
    const doc = await db.collection('reports').doc(reportId).get();
    if (!doc.exists) return null;

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.() || data?.updatedAt,
    };
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}
