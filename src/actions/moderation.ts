'use server';

import { revalidatePath } from 'next/cache';
import type { ReportStatus, ReportCategory, ReportTargetType, Report, Comment, User } from '@/types/db';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';

const supabaseAdmin = _supabaseAdmin!;

export async function getReports(
  status?: ReportStatus,
  page: number = 1,
  limit: number = 20
): Promise<{ reports: Report[]; total: number; totalPages: number }> {
  if (!supabaseAdmin) {
    return { reports: [], total: 0, totalPages: 0 };
  }

  try {
    let query = supabaseAdmin
      .from('reports')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    const reports = (data || []) as Report[];

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
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    await supabaseAdmin.from('reports').update({
      status: action,
      resolution_note: resolutionNote || null,
      resolved_at: new Date().toISOString(),
      handled_by_user_id: adminId || 'admin',
      updated_at: new Date().toISOString(),
    }).eq('id', reportId);

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
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    const banData = {
      user_id: userId,
      banned_by_user_id: adminId || 'admin',
      reason_category: reasonCategory,
      reason_text: reasonText,
      ends_at: durationDays 
        ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
        : null,
      created_at: new Date().toISOString(),
    };

    await supabaseAdmin.from('banned_users').upsert(banData);

    await supabaseAdmin.from('users').update({
      status: 'BANNED',
      banned_at: new Date().toISOString(),
      ban_reason: reasonText,
    }).eq('id', userId);

    revalidatePath('/admin/moderation');
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error banning user:', error);
    return { success: false, error: 'Failed to ban user' };
  }
}

export async function unbanUser(userId: string) {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    await supabaseAdmin.from('banned_users').delete().eq('user_id', userId);

    await supabaseAdmin.from('users').update({
      status: 'ACTIVE',
      banned_at: null,
      ban_reason: null,
    }).eq('id', userId);

    revalidatePath('/admin/moderation');
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error unbanning user:', error);
    return { success: false, error: 'Failed to unban user' };
  }
}

export async function hideComment(commentId: string, reason?: string) {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    await supabaseAdmin.from('comments').update({
      is_hidden: true,
      hidden_reason: reason || 'Hidden by moderator',
      hidden_at: new Date().toISOString(),
    }).eq('id', commentId);

    revalidatePath('/admin/moderation');
    return { success: true };
  } catch (error) {
    console.error('Error hiding comment:', error);
    return { success: false, error: 'Failed to hide comment' };
  }
}

export async function deleteComment(commentId: string) {
  if (!supabaseAdmin) {
    return { success: false, error: 'Database not configured' };
  }

  try {
    await supabaseAdmin.from('comments').delete().eq('id', commentId);

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
): Promise<{ comments: (Comment & { hidden_reason?: string; hidden_at?: string })[]; total: number; totalPages: number }> {
  if (!supabaseAdmin) {
    return { comments: [], total: 0, totalPages: 0 };
  }

  try {
    const { data, count, error } = await supabaseAdmin
      .from('comments')
      .select('*', { count: 'exact' })
      .eq('is_hidden', true)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);
    const comments = (data || []) as (Comment & { hidden_reason?: string; hidden_at?: string })[];

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
  if (!supabaseAdmin) {
    return { users: [], total: 0, totalPages: 0 };
  }

  try {
    const { data: bannedData, count, error } = await supabaseAdmin
      .from('banned_users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    const users = await Promise.all((bannedData || []).map(async (banData: any) => {
      let userData: User | null = null;
      
      try {
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', banData.user_id)
          .single();
        userData = user as User | null;
      } catch (e) {
        console.error('Error fetching user data:', e);
      }

      return {
        id: banData.id,
        ...banData,
        user: userData,
        created_at: banData.created_at,
        ends_at: banData.ends_at,
      };
    }));

    return { users, total, totalPages };
  } catch (error) {
    console.error('Error fetching banned users:', error);
    return { users: [], total: 0, totalPages: 0 };
  }
}

export async function getReportById(reportId: string) {
  if (!supabaseAdmin) return null;

  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error || !data) return null;
    return data;
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
}
