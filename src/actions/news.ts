'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import { NewsItem } from '@/types';
import { verifyAdminAction, verifyServerSession } from '@/lib/auth-utils';
import type { UserRole } from '@/types/db';

const supabaseAdmin = _supabaseAdmin!;

const TABLE_NAME = 'news';

export async function getNewsAction() {
    try {
        const { data, error } = await supabaseAdmin
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return (data || []).map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            content: item.content,
            slug: item.slug,
            status: item.status,
            tags: item.tags,
            authorName: item.author_name,
            authorAvatar: item.author_avatar,
            authorRole: item.author_role,
            seoTitle: item.seo_title,
            seoDescription: item.seo_description,
            type: item.type,
            thumbnailText: item.thumbnail_text,
            gradient: item.gradient,
            image: item.image,
            date: item.date,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
        })) as NewsItem[];
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

export async function getNewsBySlugAction(slug: string) {
    try {
        // Try searching by slug first
        let { data: item, error } = await supabaseAdmin
            .from(TABLE_NAME)
            .select('*')
            .eq('slug', slug)
            .single();
        
        // Fallback to ID if no slug match
        if (error || !item) {
            const { data: itemById, error: idError } = await supabaseAdmin
                .from(TABLE_NAME)
                .select('*')
                .eq('id', slug)
                .single();
            
            if (idError || !itemById) return null;
            item = itemById;
        }

        return {
            id: item.id,
            title: item.title,
            description: item.description,
            content: item.content,
            slug: item.slug,
            status: item.status,
            tags: item.tags,
            authorName: item.author_name,
            authorAvatar: item.author_avatar,
            authorRole: item.author_role,
            seoTitle: item.seo_title,
            seoDescription: item.seo_description,
            type: item.type,
            thumbnailText: item.thumbnail_text,
            gradient: item.gradient,
            image: item.image,
            date: item.date,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
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

    try {
        const { id, ...newsData } = news;
        
        // Auto-generate slug if not provided
        if (!newsData.slug && newsData.title) {
            newsData.slug = newsData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        
        // Ensure default type is 'article' for new blogs
        if (!newsData.type) {
            newsData.type = 'article';
        }

        if (!newsData.status) {
            newsData.status = 'published';
        }

        // Add author role
        const mappedData: any = {
            title: newsData.title,
            description: newsData.description,
            content: newsData.content,
            slug: newsData.slug,
            status: newsData.status,
            tags: newsData.tags,
            author_name: newsData.authorName,
            author_avatar: newsData.authorAvatar,
            author_role: session.role,
            seo_title: newsData.seoTitle,
            seo_description: newsData.seoDescription,
            type: newsData.type,
            thumbnail_text: newsData.thumbnailText,
            gradient: newsData.gradient,
            image: newsData.image,
            date: newsData.date || new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        
        if (id) {
            const { error } = await supabaseAdmin
                .from(TABLE_NAME)
                .update(mappedData)
                .eq('id', id);
            if (error) throw error;
        } else {
            mappedData.created_at = new Date().toISOString();
            const { error } = await supabaseAdmin
                .from(TABLE_NAME)
                .insert(mappedData);
            if (error) throw error;
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

    try {
        const { error } = await supabaseAdmin
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);
        if (error) throw error;
        
        revalidatePath('/news');
        revalidatePath('/admin/news');
        return { success: true };
    } catch (error) {
        console.error('Error deleting news:', error);
        return { success: false, error: 'Failed to delete news' };
    }
}
