'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase as _supabase } from '@/lib/supabase';

const supabase = _supabase!;

export interface AnimeReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  animeId: string;
  animeTitle: string;
  animePoster: string;
  rating: number; // 1-10
  content: string;
  hasSpoilers: boolean;
  likes: number;
  createdAt: any;
  updatedAt: any;
}

export function useAnimeReviews(animeId: string) {
  const { user } = useSupabaseAuth();
  const [reviews, setReviews] = useState<AnimeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  const fetchReviews = useCallback(async () => {
    if (!animeId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('reviews')
      .select('*, users(username, avatar_url)')
      .eq('anime_id', animeId)
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(50);

    if (fetchError) {
      console.error('Error fetching reviews:', fetchError);
      setError('Failed to load reviews');
    } else {
      const mappedData = (data || []).map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.users?.username || 'Anonymous',
        userAvatar: r.users?.avatar_url || '',
        animeId: r.anime_id,
        animeTitle: r.anime_title,
        animePoster: r.anime_poster,
        rating: r.rating,
        content: r.content,
        hasSpoilers: r.is_spoiler || false,
        likes: r.likes,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })) as AnimeReview[];
      setReviews(mappedData);
      
      // Calculate average
      if (mappedData.length > 0) {
        const sum = mappedData.reduce((acc, r) => acc + r.rating, 0);
        setAverageRating(sum / mappedData.length);
        setTotalReviews(mappedData.length);
      } else {
        setAverageRating(0);
        setTotalReviews(0);
      }
    }
    setLoading(false);
  }, [animeId]);

  useEffect(() => {
    fetchReviews();

    if (!animeId) return;

    const channel = supabase
      .channel(`anime_reviews:${animeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `anime_id=eq.${animeId}`,
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [animeId, fetchReviews]);

  const addReview = useCallback(async (
    animeTitle: string,
    animePoster: string,
    rating: number,
    content: string,
    hasSpoilers: boolean = false
  ) => {
    if (!user || !animeId) {
      throw new Error('Cannot add review');
    }

    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      anime_id: animeId,
      anime_title: animeTitle,
      anime_poster: animePoster,
      rating,
      content,
      is_spoiler: hasSpoilers,
      status: 'PUBLISHED',
    });

    if (error) throw error;
  }, [user, animeId]);

  const updateReview = useCallback(async (
    reviewId: string,
    rating: number,
    content: string,
    hasSpoilers: boolean
  ) => {
    if (!user || !animeId) {
      throw new Error('Cannot update review');
    }

    const { error } = await supabase
      .from('reviews')
      .update({
        rating,
        content,
        is_spoiler: hasSpoilers,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user, animeId]);

  const deleteReview = useCallback(async (reviewId: string) => {
    if (!user || !animeId) {
      throw new Error('Cannot delete review');
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user, animeId]);

  const likeReview = useCallback(async (reviewId: string) => {
    if (!user || !animeId) return;

    // Use a RPC or update with increment if available, but for now simple update
    // Note: This is a bit race-condition prone without RPC
    const { data: review } = await supabase
      .from('reviews')
      .select('likes')
      .eq('id', reviewId)
      .single();

    if (review) {
      await supabase
        .from('reviews')
        .update({ likes: (review.likes || 0) + 1 })
        .eq('id', reviewId);
    }
  }, [user, animeId]);

  const getUserReview = useCallback(() => {
    if (!user) return null;
    return reviews.find(r => r.userId === user.id) || null;
  }, [reviews, user]);

  return {
    reviews,
    loading,
    error,
    averageRating,
    totalReviews,
    addReview,
    updateReview,
    deleteReview,
    likeReview,
    getUserReview,
  };
}
