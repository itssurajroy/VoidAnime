'use server';

import { revalidatePath } from 'next/cache';
import type { UserRole, UserStatus } from '@/types/db';
import { db, auth } from '@/lib/firebase-admin';
import { verifyAdminAction } from '@/lib/auth-utils';

async function updateUser(userId: string, data: { role?: UserRole, status?: UserStatus }) {
    const isAdmin = await verifyAdminAction();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized.' };
    }

    if (!db || !auth) {
        return { success: false, error: 'Firebase Admin not initialized.' };
    }
    if (!userId) {
        return { success: false, error: 'User ID is required.' };
    }

    try {
        const userRef = db.collection('users').doc(userId);
        await userRef.update(data);
        
        // Also update Firebase Auth disabled status if status is changed
        if (data.status) {
            const isDisabled = data.status === 'BANNED';
            await auth.updateUser(userId, { disabled: isDisabled });
        }

        revalidatePath('/admin/users');
        revalidatePath('/admin/moderation');
        return { success: true, message: `User ${userId} updated successfully.` };
    } catch (error) {
        console.error('Failed to update user:', error);
        return { success: false, error: 'Failed to update user.' };
    }
}

export async function updateUserRole(userId: string, role: UserRole) {
    const result = await updateUser(userId, { role });
    if (!result.success) return { success: false, error: result.error };
    return { success: true };
}

export async function updateUserStatus(userId: string, status: UserStatus, reason?: string) {
    const isAdmin = await verifyAdminAction();
    if (!isAdmin) return { success: false, error: 'Unauthorized.' };
    
    const result = await updateUser(userId, { status });
    if (!result.success) return { success: false, error: result.error };

    if (status === 'BANNED' && reason && db) {
        await db.collection('bannedUsers').add({
            userId,
            reason,
            bannedAt: new Date().toISOString(),
            status: 'ACTIVE'
        });
    }

    return { success: true };
}

export async function toggleShadowBan(userId: string, shadowBanned: boolean) {
    const isAdmin = await verifyAdminAction();
    if (!isAdmin) return { success: false, error: 'Unauthorized.' };

    if (!db) return { success: false, error: 'Database not configured' };

    try {
        await db.collection('users').doc(userId).update({
            isShadowBanned: shadowBanned,
            updatedAt: new Date().toISOString()
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle shadow ban:', error);
        return { success: false, error: 'Failed to update user' };
    }
}

export async function addModeratorNote(userId: string, adminId: string, adminName: string, note: string) {
    const isAdmin = await verifyAdminAction();
    if (!isAdmin) return { success: false, error: 'Unauthorized.' };

    if (!db) return { success: false, error: 'Database not configured' };

    try {
        const noteRef = db.collection('users').doc(userId).collection('moderatorNotes').doc();
        await noteRef.set({
            adminId,
            adminName,
            note,
            createdAt: new Date().toISOString()
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        console.error('Failed to add moderator note:', error);
        return { success: false, error: 'Failed to add note' };
    }
}

export async function inviteUser(email: string, role: UserRole = 'USER') {
    const isAdmin = await verifyAdminAction();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized.' };
    }

    if (!db) {
        return { success: false, error: 'Database not configured' };
    }

    try {
        const invitationRef = db.collection('userInvitations').doc();
        await invitationRef.set({
            email,
            role,
            invitedBy: 'admin',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

        return { success: true, invitationId: invitationRef.id };
    } catch (error) {
        console.error('Failed to invite user:', error);
        return { success: false, error: 'Failed to send invitation' };
    }
}

export async function getUserActivityHistory(userId: string, limit: number = 20) {
    if (!db) {
        return [];
    }

    try {
        const watchHistorySnapshot = await db.collection('users').doc(userId)
            .collection('watchHistory')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        const reviewsSnapshot = await db.collection('users').doc(userId)
            .collection('reviews')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();

        const activities: Array<{
            type: 'watch' | 'review' | 'comment' | 'favorite';
            timestamp: Date;
            data: Record<string, unknown>;
        }> = [];

        watchHistorySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            activities.push({
                type: 'watch',
                timestamp: data.watchedAt?.toDate?.() || new Date(data.watchedAt || Date.now()),
                data: { animeId: doc.id, ...data },
            });
        });

        reviewsSnapshot.docs.forEach((doc) => {
            const data = doc.data();
            activities.push({
                type: 'review',
                timestamp: data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now()),
                data: { animeId: doc.id, ...data },
            });
        });

        return activities.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ).slice(0, limit);
    } catch (error) {
        console.error('Failed to get user activity:', error);
        return [];
    }
}

export async function getUserById(userId: string) {
    if (!db) {
        return null;
    }

    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return null;
        }

        const data = userDoc.data();
        return {
            id: userDoc.id,
            ...data,
            createdAt: data?.createdAt?.toDate?.() || data?.createdAt,
            lastLoginAt: data?.lastLoginAt?.toDate?.() || data?.lastLoginAt,
        };
    } catch (error) {
        console.error('Failed to get user:', error);
        return null;
    }
}

export async function searchUsers(query: string, limit: number = 20) {
    if (!db || !query) {
        return [];
    }

    try {
        const snapshot = await db.collection('users')
            .where('name', '>=', query)
            .where('name', '<=', query + '\uf8ff')
            .limit(limit)
            .get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Failed to search users:', error);
        return [];
    }
}
