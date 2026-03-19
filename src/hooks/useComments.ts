'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase as _supabase } from '@/lib/supabase';
import { checkSpam } from '@/lib/spam-guard';

const supabase = _supabase!;

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: any;
  updatedAt: any;
  likes: number;
  parentId: string | null;
  isHidden: boolean;
  editCount?: number;
  animeTitle?: string;
}

export function useComments(animeId: string) {
  const { user } = useSupabaseAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spamError, setSpamError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!animeId) {
      setComments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('comments')
      .select('*, users(username, avatar_url)')
      .eq('anime_id', animeId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (fetchError) {
      console.error('Error fetching comments:', fetchError);
      setError('Failed to load comments');
    } else {
      const mappedData = (data || []).map((c: any) => ({
        id: c.id,
        userId: c.user_id,
        userName: c.users?.username || 'Anonymous',
        userAvatar: c.users?.avatar_url || '',
        content: c.content,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        likes: c.likes || 0,
        parentId: c.parent_id,
        isHidden: c.is_hidden || false,
        editCount: c.edit_count || 0,
        animeTitle: c.anime_title,
      })) as Comment[];
      setComments(mappedData.filter(c => !c.isHidden));
    }
    setLoading(false);
  }, [animeId]);

  useEffect(() => {
    fetchComments();

    if (!animeId) return;

    const channel = supabase
      .channel(`anime_comments:${animeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `anime_id=eq.${animeId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [animeId, fetchComments]);

  const addComment = useCallback(async (content: string, animeTitle: string, parentId: string | null = null) => {
    if (!user || !content.trim() || !animeId) {
      throw new Error('Cannot add comment');
    }

    setSpamError(null);
    const spamCheck = checkSpam(content, comments, user.id);
    if (spamCheck.isSpam) {
      setSpamError(spamCheck.reason || "Your comment has been flagged as spam.");
      return;
    }

    const { data: newComment, error: insertError } = await supabase.from('comments').insert({
      user_id: user.id,
      anime_id: animeId,
      content: content.trim(),
      parent_id: parentId,
      anime_title: animeTitle,
      likes: 0,
      is_hidden: false,
      edit_count: 0,
    }).select().single();

    if (insertError) throw insertError;

    // If it's a reply, notify the parent comment owner
    if (parentId) {
      const parentComment = comments.find(c => c.id === parentId);
      if (parentComment && parentComment.userId !== user.id) {
        await supabase.from('notifications').insert({
          user_id: parentComment.userId,
          type: 'REPLY',
          title: 'New Reply',
          message: `${user.user_metadata?.username || 'Someone'} replied to your comment on ${animeTitle}`,
          data: {
            link: `/watch/${animeId}`,
            senderId: user.id,
            senderName: user.user_metadata?.username,
            senderAvatar: user.user_metadata?.avatar_url,
          },
        });
      }
    }
  }, [user, animeId, comments]);

  const updateComment = useCallback(async (commentId: string, newContent: string) => {
    if (!user || !animeId) {
      throw new Error('Cannot update comment');
    }

    const { data: currentComment } = await supabase
      .from('comments')
      .select('edit_count')
      .eq('id', commentId)
      .single();

    const { error } = await supabase
      .from('comments')
      .update({
        content: newContent.trim(),
        updated_at: new Date().toISOString(),
        edit_count: (currentComment?.edit_count || 0) + 1,
      })
      .eq('id', commentId)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user, animeId]);


  const deleteComment = useCallback(async (commentId: string) => {
    if (!user || !animeId) {
      throw new Error('Cannot delete comment');
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user, animeId]);

  const likeComment = useCallback(async (commentId: string) => {
    if (!user || !animeId) return;

    // Update likes
    const { data: commentData } = await supabase.from('comments').select('likes, user_id, anime_title').eq('id', commentId).single();
    if (commentData) {
      await supabase.from('comments').update({ likes: (commentData.likes || 0) + 1 }).eq('id', commentId);

      if (commentData.user_id !== user.id) {
        await supabase.from('notifications').insert({
          user_id: commentData.user_id,
          type: 'LIKE',
          title: 'Comment Liked',
          message: `${user.user_metadata?.username || 'Someone'} liked your comment on ${commentData.anime_title || 'an anime'}`,
          data: {
            link: `/watch/${animeId}`,
            senderId: user.id,
            senderName: user.user_metadata?.username,
            senderAvatar: user.user_metadata?.avatar_url,
          },
        });
      }
    }
  }, [user, animeId]);

  const hideComment = useCallback(async (commentId: string) => {
    if (!animeId) return;
    
    await supabase
      .from('comments')
      .update({ is_hidden: true })
      .eq('id', commentId);
  }, [animeId]);

  const getReplies = useCallback((parentId: string) => {
    return comments.filter(c => c.parentId === parentId);
  }, [comments]);

  return {
    comments,
    loading,
    error,
    spamError,
    setSpamError,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    hideComment,
    getReplies,
  };
}
