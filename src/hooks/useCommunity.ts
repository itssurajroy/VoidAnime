'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase as _supabase } from '@/lib/supabase';

const supabase = _supabase!;

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  category: string;
  image?: string;
  createdAt: any;
  updatedAt: any;
  likes: number;
  commentsCount: number;
  isPinned: boolean;
  isAdmin: boolean;
  isHidden?: boolean;
  reportCount?: number;
}

export function useCommunity(categoryFilter: string = 'all') {
  const { user } = useSupabaseAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('community_posts')
      .select('*, users(username, avatar_url, role)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter.toUpperCase());
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      console.error('Error fetching community posts:', fetchError);
      setError('Failed to load posts');
    } else {
      const mappedPosts = (data || []).map((p: any) => ({
        id: p.id,
        userId: p.user_id,
        userName: p.users?.username || 'Anonymous',
        userAvatar: p.users?.avatar_url || '',
        title: p.title,
        content: p.content,
        category: p.category,
        image: p.image || null,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
        likes: p.likes || 0,
        commentsCount: p.comments_count || 0,
        isPinned: p.is_pinned || false,
        isAdmin: p.users?.role === 'ADMIN' || p.users?.role === 'SUPER_ADMIN',
        isHidden: p.is_hidden || false,
        reportCount: p.report_count || 0,
      })) as CommunityPost[];
      
      // Sort pinned posts to the top
      mappedPosts.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      setPosts(mappedPosts);
    }
    setLoading(false);
  }, [categoryFilter]);

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel('community_posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts',
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPosts]);

  const addPost = useCallback(async (title: string, content: string, category: string, isAdminStatus: boolean = false, imageUrl?: string) => {
    if (!user || !title.trim() || !content.trim()) {
      throw new Error('Cannot add post');
    }

    const { data, error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      title: title.trim(),
      content: content.trim(),
      category: category.toUpperCase(),
      image: imageUrl || null,
      likes: 0,
      comments_count: 0,
      is_pinned: false,
      is_hidden: false,
      report_count: 0,
    }).select().single();

    if (error) throw error;
    return data.id;
  }, [user]);

  const deletePost = useCallback(async (postId: string) => {
    if (!user) throw new Error('Cannot delete post');

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user]);

  const updatePost = useCallback(async (postId: string, newTitle: string, newContent: string, imageUrl?: string) => {
    if (!user || !newTitle.trim() || !newContent.trim()) {
      throw new Error('Cannot update post');
    }

    const { error } = await supabase
      .from('community_posts')
      .update({
        title: newTitle.trim(),
        content: newContent.trim(),
        image: imageUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user]);

  const likePost = useCallback(async (postId: string) => {
    if (!user) return;

    const { data: post } = await supabase.from('community_posts').select('likes').eq('id', postId).single();
    if (post) {
      await supabase.from('community_posts').update({ likes: (post.likes || 0) + 1 }).eq('id', postId);
    }
  }, [user]);

  const togglePin = useCallback(async (postId: string, currentPinStatus: boolean) => {
    if (!user) return;
    await supabase
      .from('community_posts')
      .update({
        is_pinned: !currentPinStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);
  }, [user]);

  const hidePost = useCallback(async (postId: string, currentHiddenStatus: boolean) => {
    if (!user) return;
    await supabase
      .from('community_posts')
      .update({
        is_hidden: !currentHiddenStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', postId);
  }, [user]);

  const reportPost = useCallback(async (postId: string) => {
    if (!user) return;
    const { data: post } = await supabase.from('community_posts').select('report_count').eq('id', postId).single();
    if (post) {
      await supabase
        .from('community_posts')
        .update({
          report_count: (post.report_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', postId);
    }
  }, [user]);

  return {
    posts,
    loading,
    error,
    addPost,
    deletePost,
    updatePost,
    likePost,
    togglePin,
    hidePost,
    reportPost
  };
}
