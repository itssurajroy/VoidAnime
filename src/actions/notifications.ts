'use server';

import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { Notification, NotificationType } from '@/types/db';

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
    if (!db) return { success: false, error: 'Firebase Admin not initialized' };
    await db.collection('notifications').add({
      ...data,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function getNotifications(userId: string, max: number = 20) {
  try {
    if (!db) return { success: false, error: 'Firebase Admin not initialized' };
    const snapshot = await db.collection('notifications')
      .where('recipientId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(max)
      .get();

    const notifications = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now()),
      };
    }) as Notification[];

    return { success: true, notifications };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    if (!db) return { success: false, error: 'Firebase Admin not initialized' };
    await db.collection('notifications').doc(notificationId).update({ isRead: true });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: 'Failed to update notification' };
  }
}

export async function markAllAsRead(userId: string) {
  try {
    if (!db) return { success: false, error: 'Firebase Admin not initialized' };
    const snapshot = await db.collection('notifications')
      .where('recipientId', '==', userId)
      .where('isRead', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { success: false, error: 'Failed to update notifications' };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    if (!db) return { success: false, error: 'Firebase Admin not initialized' };
    await db.collection('notifications').doc(notificationId).delete();
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}
