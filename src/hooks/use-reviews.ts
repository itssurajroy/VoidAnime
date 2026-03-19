'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase as _supabase } from '@/lib/supabase';

const supabase = _supabase!;

export interface UserReview {
  id: string;
  animeId: string;
  animeTitle: string;
  animePoster: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function useReviews() {
  const { user } = useSupabaseAuth();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!user) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      const mappedData = (data || []).map(r => ({
        id: r.id,
        animeId: r.anime_id,
        animeTitle: r.anime_title,
        animePoster: r.anime_poster,
        rating: r.rating,
        content: r.content,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      })) as UserReview[];
      setReviews(mappedData);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchReviews();

    if (!user) return;

    const channel = supabase
      .channel(`user_reviews:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchReviews]);

  const addReview = useCallback(async (
    animeId: string,
    animeTitle: string,
    animePoster: string,
    rating: number,
    content: string
  ) => {
    if (!user) return;

    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      anime_id: animeId,
      anime_title: animeTitle,
      anime_poster: animePoster,
      rating,
      content,
      status: 'PUBLISHED',
    });

    if (error) throw error;
  }, [user]);

  const updateReview = useCallback(async (
    reviewId: string,
    rating: number,
    content: string
  ) => {
    if (!user) return;

    const { error } = await supabase
      .from('reviews')
      .update({
        rating,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user]);

  const deleteReview = useCallback(async (reviewId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id);

    if (error) throw error;
  }, [user]);

  return { reviews, loading, addReview, updateReview, deleteReview };
}
