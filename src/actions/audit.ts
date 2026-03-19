'use server';

import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = _supabaseAdmin!;

export type AuditLogAction = 
  | 'USER_CREATED'
  | 'USER_UPDATED'
  | 'USER_DELETED'
  | 'USER_BANNED'
  | 'USER_UNBANNED'
  | 'ROLE_CHANGED'
  | 'REPORT_RESOLVED'
  | 'REPORT_DISMISSED'
  | 'COMMENT_HIDDEN'
  | 'COMMENT_DELETED'
  | 'SETTINGS_UPDATED'
  | 'FEATURE_FLAG_CHANGED'
  | 'MAINTENANCE_MODE_CHANGED'
  | 'CACHE_CLEARED'
  | 'CUSTOM_PAGE_CREATED'
  | 'CUSTOM_PAGE_UPDATED'
  | 'CUSTOM_PAGE_DELETED';

export interface AuditLog {
  id: string;
  action: AuditLogAction;
  targetType: 'USER' | 'REPORT' | 'COMMENT' | 'SETTINGS' | 'PAGE' | 'SYSTEM';
  targetId: string;
  adminId: string;
  adminName?: string;
  details: Record<string, string | number | boolean | null>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export async function createAuditLog(
  action: AuditLogAction,
  targetType: AuditLog['targetType'],
  targetId: string,
  adminId: string,
  details: Record<string, string | number | boolean | null> = {},
  ipAddress?: string,
  userAgent?: string
): Promise<{ success: boolean; logId?: string }> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_audit_logs')
      .insert([{
        action,
        target_type: targetType,
        target_id: targetId,
        admin_id: adminId,
        details,
        ip_address: ipAddress || 'server',
        user_agent: userAgent || 'server',
        timestamp: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    return { success: true, logId: data.id };
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return { success: false };
  }
}

export async function getAuditLogs(
  page: number = 1,
  limit: number = 50,
  action?: AuditLogAction,
  targetType?: AuditLog['targetType'],
  adminId?: string,
  startDate?: string,
  endDate?: string
): Promise<{ logs: AuditLog[]; total: number; totalPages: number }> {
  try {
    let query = supabaseAdmin
      .from('admin_audit_logs')
      .select('*', { count: 'exact' });

    if (action) {
      query = query.eq('action', action);
    }
    if (targetType) {
      query = query.eq('target_type', targetType);
    }
    if (adminId) {
      query = query.eq('admin_id', adminId);
    }
    if (startDate) {
      query = query.gte('timestamp', startDate);
    }
    if (endDate) {
      query = query.lte('timestamp', endDate);
    }

    const { data, count, error } = await query
      .order('timestamp', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    const logs: AuditLog[] = data?.map(row => ({
      id: row.id,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      adminId: row.admin_id,
      adminName: row.admin_name,
      details: row.details,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      timestamp: row.timestamp,
    })) || [];

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return { logs, total, totalPages };
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return { logs: [], total: 0, totalPages: 0 };
  }
}

export async function getAuditLogById(logId: string): Promise<AuditLog | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_audit_logs')
      .select('*')
      .eq('id', logId)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      action: data.action,
      targetType: data.target_type,
      targetId: data.target_id,
      adminId: data.admin_id,
      adminName: data.admin_name,
      details: data.details,
      ipAddress: data.ip_address,
      userAgent: data.user_agent,
      timestamp: data.timestamp,
    } as AuditLog;
  } catch (error) {
    console.error('Failed to get audit log:', error);
    return null;
  }
}

export async function getAuditLogStats(days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabaseAdmin
      .from('admin_audit_logs')
      .select('action, admin_id')
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;

    const byAction: Record<string, number> = {};
    const byAdmin: Record<string, number> = {};
    let total = 0;

    data?.forEach((row) => {
      total++;
      byAction[row.action as string] = (byAction[row.action as string] || 0) + 1;
      byAdmin[row.admin_id as string] = (byAdmin[row.admin_id as string] || 0) + 1;
    });

    return { total, byAction, byAdmin };
  } catch (error) {
    console.error('Failed to get audit log stats:', error);
    return { total: 0, byAction: {}, byAdmin: {} };
  }
}
