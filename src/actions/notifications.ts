'use server';

import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import { Notification, NotificationType } from '@/types/db';

const supabaseAdmin = _supabaseAdmin!;

export async function createNotification(data: {
  recipientId: string;
  senderId?: string | null;
  senderName?: string | null;
  senderAvatar?: string | null;
  type: NotificationType;
  title: string;
  content: string;
  link?: string | null;
}) {
  try {
    const { error } = await supabaseAdmin.from('notifications').insert({
      user_id: data.recipientId,
      sender_id: data.senderId,
      sender_name: data.senderName,
      sender_avatar: data.senderAvatar,
      type: data.type,
      title: data.title,
      message: data.content,
      link: data.link,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function getNotifications(userId: string, max: number = 20) {
  try {
    const { data, error } = await supabaseAdmin.from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(max);

    if (error) throw error;

    const notifications = (data || []).map(item => ({
      id: item.id,
      recipientId: item.user_id,
      senderId: item.sender_id,
      senderName: item.sender_name,
      senderAvatar: item.sender_avatar,
      type: item.type as NotificationType,
      title: item.title,
      content: item.message,
      link: item.link,
      isRead: item.is_read,
      createdAt: new Date(item.created_at),
    })) as Notification[];

    return { success: true, notifications };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to update notification' };
  }
}

export async function markAllAsRead(userId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to update notifications' };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}
