'use server';

import { revalidatePath } from 'next/cache';
import type { UserRole, UserStatus } from '@/types/db';
import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import { verifyAdminAction } from '@/lib/auth-utils';

const supabaseAdmin = _supabaseAdmin!;

async function updateUser(userId: string, data: { role?: UserRole, status?: UserStatus }) {
    const isAdmin = await verifyAdminAction();
    if (!isAdmin) {
        return { success: false, error: 'Unauthorized.' };
    }

    if (!userId) {
        return { success: false, error: 'User ID is required.' };
    }

    try {
        const mappedData: any = {
            updated_at: new Date().toISOString()
        };
        if (data.role) mappedData.role = data.role;
        if (data.status) mappedData.status = data.status;

        const { error: tableError } = await supabaseAdmin
            .from('users')
            .update(mappedData)
            .eq('id', userId);
        
        if (tableError) throw tableError;
        
        // Also update Supabase Auth ban status if status is changed
        if (data.status) {
            const isBanned = data.status === 'BANNED';
            if (isBanned) {
                await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: '8760h' });
            } else {
                await supabaseAdmin.auth.admin.updateUserById(userId, { ban_duration: 'none' });
            }
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

    if (status === 'BANNED' && reason) {
        await supabaseAdmin.from('banned_users').insert({
            user_id: userId,
            reason,
            banned_at: new Date().toISOString(),
            status: 'ACTIVE'
        });
    }

    return { success: true };
}

export async function toggleShadowBan(userId: string, shadowBanned: boolean) {
    const isAdmin = await verifyAdminAction();
    if (!isAdmin) return { success: false, error: 'Unauthorized.' };

    try {
        const { error } = await supabaseAdmin.from('users').update({
            is_shadow_banned: shadowBanned,
            updated_at: new Date().toISOString()
        }).eq('id', userId);

        if (error) throw error;
        
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

    try {
        const { error } = await supabaseAdmin.from('moderator_notes').insert({
            user_id: userId,
            admin_id: adminId,
            admin_name: adminName,
            note,
            created_at: new Date().toISOString()
        });
        
        if (error) throw error;
        
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

    try {
        const { data, error } = await supabaseAdmin.from('user_invitations').insert({
            email,
            role,
            invited_by: 'admin',
            status: 'PENDING',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }).select('id').single();

        if (error) throw error;
        return { success: true, invitationId: data.id };
    } catch (error) {
        console.error('Failed to invite user:', error);
        return { success: false, error: 'Failed to send invitation' };
    }
}

export async function getUserActivityHistory(userId: string, limit: number = 20) {
    try {
        const { data: watchHistory, error: watchError } = await supabaseAdmin
            .from('watch_history')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        const { data: reviews, error: reviewError } = await supabaseAdmin
            .from('reviews')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        const activities: Array<{
            type: 'watch' | 'review' | 'comment' | 'favorite';
            timestamp: Date;
            data: Record<string, unknown>;
        }> = [];

        (watchHistory || []).forEach((item) => {
            activities.push({
                type: 'watch',
                timestamp: new Date(item.created_at),
                data: { 
                    animeId: item.anime_id,
                    animeTitle: item.anime_title,
                    episodeNumber: item.episode_number,
                    progress: item.progress,
                    duration: item.duration,
                    completed: item.completed
                },
            });
        });

        (reviews || []).forEach((item) => {
            activities.push({
                type: 'review',
                timestamp: new Date(item.created_at),
                data: { 
                    animeId: item.anime_id,
                    animeTitle: item.anime_title,
                    rating: item.rating,
                    title: item.title,
                    content: item.content
                },
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
    try {
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.username,
            avatarUrl: user.avatar_url,
            bio: user.bio,
            role: user.role,
            status: user.status,
            xp: user.xp,
            level: user.level,
            voidCoins: user.void_coins,
            currentStreak: user.current_streak,
            longestStreak: user.longest_streak,
            badges: user.badges,
            createdAt: new Date(user.created_at),
            lastLoginAt: user.updated_at ? new Date(user.updated_at) : new Date(user.created_at),
        };
    } catch (error) {
        console.error('Failed to get user:', error);
        return null;
    }
}

export async function searchUsers(query: string, limit: number = 20) {
    if (!query) {
        return [];
    }

    try {
        const { data: users, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
            .limit(limit);

        if (error) throw error;

        return (users || []).map((user) => ({
            id: user.id,
            email: user.email,
            name: user.username,
            avatarUrl: user.avatar_url,
            role: user.role,
            status: user.status,
            createdAt: user.created_at,
        }));
    } catch (error) {
        console.error('Failed to search users:', error);
        return [];
    }
}
