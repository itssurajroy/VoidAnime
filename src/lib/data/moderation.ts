import 'server-only';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import type { ReportWithReporter } from '@/types/moderation';
import type { ReportStatus } from '@/types/db';

const supabaseAdmin = _supabaseAdmin!;

interface GetReportsFilters {
  status?: ReportStatus;
  category?: string;
  targetType?: string;
  page?: number;
  limit?: number;
}

export async function getReports(filters: GetReportsFilters): Promise<{ reports: ReportWithReporter[], total: number, totalPages: number }> {
  const { status, page = 1, limit = 20 } = filters;

  try {
    let query = supabaseAdmin
      .from('reports')
      .select(`
        *,
        reporter:users!reports_reporter_id_fkey (
          id,
          username,
          email
        )
      `, { count: 'exact' });
    
    // Fallback if the fkey name is different or not explicitly needed
    // .select('*, reporter:users(id, username, email)', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    const reports: ReportWithReporter[] = (data || []).map((report: any) => ({
      id: report.id,
      reporterId: report.reporter_id,
      targetType: report.target_type,
      targetId: report.target_id,
      category: report.category,
      reasonText: report.reason_text,
      status: report.status,
      createdAt: report.created_at ? new Date(report.created_at) : new Date(),
      updatedAt: report.updated_at ? new Date(report.updated_at) : new Date(),
      handledByUserId: report.handled_by_user_id,
      resolutionAction: report.resolution_action,
      resolutionNote: report.resolution_note,
      resolvedAt: report.resolved_at ? new Date(report.resolved_at) : null,
      reporter: report.reporter ? {
        id: report.reporter.id,
        name: report.reporter.username || 'Unknown',
        email: report.reporter.email || '',
      } : null,
    }));

    return { reports, total, totalPages };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { reports: [], total: 0, totalPages: 0 };
  }
}

export async function getReportById(reportId: string): Promise<ReportWithReporter | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select(`
        *,
        reporter:users!reports_reporter_id_fkey (
          id,
          username,
          email
        )
      `)
      .eq('id', reportId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      reporterId: data.reporter_id,
      targetType: data.target_type,
      targetId: data.target_id,
      category: data.category,
      reasonText: data.reason_text,
      status: data.status,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      handledByUserId: data.handled_by_user_id,
      resolutionAction: data.resolution_action,
      resolutionNote: data.resolution_note,
      resolvedAt: data.resolved_at ? new Date(data.resolved_at) : null,
      reporter: data.reporter ? {
        id: data.reporter.id,
        name: data.reporter.username || 'Unknown',
        email: data.reporter.email || '',
      } : null,
    } as any;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}
