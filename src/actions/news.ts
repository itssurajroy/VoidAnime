'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase-admin';
import { NewsItem } from '@/types';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAdminAction, verifyServerSession } from '@/lib/auth-utils';
import type { UserRole } from '@/types/db';

const COLLECTION_NAME = 'news';

export async function getNewsAction() {
    if (!db) {
        console.error('Database not initialized');
        return [];
    }

    try {
        const snapshot = await db.collection(COLLECTION_NAME)
            .orderBy('createdAt', 'desc')
            .get();
        
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : (data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString()),
            };
        }) as NewsItem[];
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

export async function getNewsBySlugAction(slug: string) {
    if (!db) return null;

    try {
        // Try searching by slug first
        let snapshot = await db.collection(COLLECTION_NAME)
            .where('slug', '==', slug)
            .limit(1)
            .get();
        
        // Fallback to ID if no slug match
        if (snapshot.empty) {
            const doc = await db.collection(COLLECTION_NAME).doc(slug).get();
            if (doc.exists) {
                const data = doc.data()!;
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
                    updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : (data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString()),
                } as NewsItem;
            }
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate().toISOString() : (data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString()),
        } as NewsItem;
    } catch (error) {
        console.error('Error fetching news by slug:', error);
        return null;
    }
}

export async function saveNewsAction(news: Partial<NewsItem>) {
    const session = await verifyServerSession();
    if (!session) return { success: false, error: 'Unauthorized.' };
    
    const adminRoles: UserRole[] = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'EDITOR', 'SEO_MANAGER', 'ANALYST'];
    if (!adminRoles.includes(session.role)) {
        return { success: false, error: 'Unauthorized.' };
    }

    if (!db) {
        return { success: false, error: 'Database not initialized' };
    }

    try {
        const { id, ...data } = news;
        
        // Auto-generate slug if not provided
        if (!data.slug && data.title) {
            data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        
        // Ensure default type is 'article' for new blogs
        if (!data.type) {
            data.type = 'article';
        }

        if (!data.status) {
            data.status = 'published';
        }

        // Add author role
        data.authorRole = session.role;
        
        if (id) {
            await db.collection(COLLECTION_NAME).doc(id).update({
                ...data,
                updatedAt: FieldValue.serverTimestamp(),
            });
        } else {
            await db.collection(COLLECTION_NAME).add({
                ...data,
                createdAt: FieldValue.serverTimestamp(),
                updatedAt: FieldValue.serverTimestamp(),
            });
        }
        
        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error) {
        console.error('Error saving news:', error);
        return { success: false, error: 'Failed to save news' };
    }
}

export async function deleteNewsAction(id: string) {
    const isAdmin = await verifyAdminAction();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized.' };
    }

    if (!db) {
        return { success: false, error: 'Database not initialized' };
    }

    try {
        await db.collection(COLLECTION_NAME).doc(id).delete();
        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error) {
        console.error('Error deleting news:', error);
        return { success: false, error: 'Failed to delete news' };
    }
}
