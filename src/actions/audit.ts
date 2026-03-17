'use server';

import { db } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

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
  if (!db) {
    return { success: false };
  }

  try {
    const logRef = db.collection('adminAuditLogs').doc();
    await logRef.set({
      action,
      targetType,
      targetId,
      adminId,
      details,
      ipAddress: ipAddress || 'server',
      userAgent: userAgent || 'server',
      timestamp: new Date().toISOString(),
    });

    return { success: true, logId: logRef.id };
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
  if (!db) {
    return { logs: [], total: 0, totalPages: 0 };
  }

  try {
    let query: any = db.collection('adminAuditLogs');

    if (action) {
      query = query.where('action', '==', action);
    }
    if (targetType) {
      query = query.where('targetType', '==', targetType);
    }
    if (adminId) {
      query = query.where('adminId', '==', adminId);
    }

    query = query.orderBy('timestamp', 'desc');

    const snapshot = await query
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    let logs: AuditLog[] = [];
    
    snapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        const logDate = data.timestamp;
        if (startDate && logDate < startDate) return;
        if (endDate && logDate > endDate) return;
        
        logs.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : (typeof data.timestamp === 'string' ? data.timestamp : new Date().toISOString()),
        } as AuditLog);
    });

    const countSnapshot = await db.collection('adminAuditLogs').count().get();
    const total = countSnapshot.data().count || 0;
    const totalPages = Math.ceil(total / limit);

    return { logs, total, totalPages };
  } catch (error) {
    console.error('Failed to get audit logs:', error);
    return { logs: [], total: 0, totalPages: 0 };
  }
}

export async function getAuditLogById(logId: string): Promise<AuditLog | null> {
  if (!db) {
    return null;
  }

  try {
    const doc = await db.collection('adminAuditLogs').doc(logId).get();
    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data?.timestamp?.toDate?.() ? data.timestamp.toDate().toISOString() : (typeof data?.timestamp === 'string' ? data.timestamp : new Date().toISOString()),
    } as AuditLog;
  } catch (error) {
    console.error('Failed to get audit log:', error);
    return null;
  }
}

export async function getAuditLogStats(days: number = 30) {
  if (!db) {
    return { total: 0, byAction: {}, byAdmin: {} };
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const snapshot = await db.collection('adminAuditLogs')
      .where('timestamp', '>=', startDate.toISOString())
      .get();

    const byAction: Record<string, number> = {};
    const byAdmin: Record<string, number> = {};
    let total = 0;

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      total++;
      
      byAction[data.action as string] = (byAction[data.action as string] || 0) + 1;
      byAdmin[data.adminId as string] = (byAdmin[data.adminId as string] || 0) + 1;
    });

    return { total, byAction, byAdmin };
  } catch (error) {
    console.error('Failed to get audit log stats:', error);
    return { total: 0, byAction: {}, byAdmin: {} };
  }
}
