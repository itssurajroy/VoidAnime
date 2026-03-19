'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { WatchlistItem, WatchlistStatus, AnimeCard } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

export interface EnhancedWatchlistItem extends WatchlistItem {
  userId?: string;
  userRating?: number;
  notes?: string;
  startedAt?: string;
  finishedAt?: string;
  isPrivate?: boolean;
  addedAt?: string;
  updatedAt?: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export function useWatchlist() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<EnhancedWatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchWatchlist = useCallback(async () => {
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const mappedData: EnhancedWatchlistItem[] = (data || []).map((item: any) => ({
        id: item.anime_id, // Map anime_id to id for UI consistency
        name: item.anime_title,
        poster: item.anime_poster,
        status: item.status,
        progress: item.progress,
        totalEpisodes: item.total_episodes,
        userRating: item.rating,
        notes: item.notes,
        addedAt: item.created_at,
        updatedAt: item.updated_at,
        userId: item.user_id,
        // Compatibility fields
        jname: item.anime_title,
      }));

      setWatchlist(mappedData);
      setError(null);
    } catch (err: any) {
      logger.error('[Watchlist] Error fetching watchlist:', err);
      setError(err);
      toast({
        variant: 'destructive',
        title: 'Error loading watchlist',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    fetchWatchlist();

    // Subscribe to realtime changes for the user's watchlist
    const channel = supabase
      .channel('public:watchlist')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'watchlist',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchWatchlist();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchWatchlist]);

  const addItem = useCallback(
    async (anime: AnimeCard, status: WatchlistStatus) => {
      if (!user) return;

      try {
        const { error: insertError } = await supabase.from('watchlist').insert({
          user_id: user.id,
          anime_id: anime.id,
          anime_title: anime.name,
          anime_poster: anime.poster,
          status,
          progress: 0,
          total_episodes: anime.episodes?.sub || anime.episodes?.dub || 0,
          updated_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;

        toast({
          title: 'Added to watchlist!',
          description: `Added to "${status.replace(/_/g, ' ')}".`,
        });
      } catch (err: any) {
        logger.error('[Watchlist] Error adding item:', err);
        toast({
          variant: 'destructive',
          title: 'Error adding item',
          description: err.message,
        });
      }
    },
    [user, toast]
  );

  const updateItem = useCallback(
    async (animeId: string, updates: Partial<EnhancedWatchlistItem>) => {
      if (!user) return;

      try {
        const supabaseUpdates: any = {
          updated_at: new Date().toISOString(),
        };

        if (updates.status) supabaseUpdates.status = updates.status;
        if (updates.progress !== undefined) supabaseUpdates.progress = updates.progress;
        if (updates.totalEpisodes !== undefined) supabaseUpdates.total_episodes = updates.totalEpisodes;
        if (updates.userRating !== undefined) supabaseUpdates.rating = updates.userRating;
        if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;

        const { error: updateError } = await supabase
          .from('watchlist')
          .update(supabaseUpdates)
          .eq('user_id', user.id)
          .eq('anime_id', animeId);

        if (updateError) throw updateError;
      } catch (err: any) {
        logger.error('[Watchlist] Error updating item:', err);
        toast({
          variant: 'destructive',
          title: 'Error updating item',
          description: err.message,
        });
      }
    },
    [user, toast]
  );

  const updateStatus = useCallback(
    async (animeId: string, status: WatchlistStatus) => {
      await updateItem(animeId, { status });
      toast({
        title: 'Watchlist updated!',
        description: `Moved to "${status.replace(/_/g, ' ')}".`,
      });
    },
    [updateItem, toast]
  );

  const updateProgress = useCallback(
    async (animeId: string, progress: number) => {
      await updateItem(animeId, { progress });
    },
    [updateItem]
  );

  const removeFromWatchlist = useCallback(
    async (animeId: string) => {
      if (!user) return;

      try {
        const { error: deleteError } = await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('anime_id', animeId);

        if (deleteError) throw deleteError;
        toast({ title: 'Removed from watchlist' });
      } catch (err: any) {
        logger.error('[Watchlist] Error removing item:', err);
        toast({
          variant: 'destructive',
          title: 'Error removing item',
          description: err.message,
        });
      }
    },
    [user, toast]
  );

  const isInWatchlist = useCallback(
    (animeId: string) => {
      return watchlist.some((item) => item.id === animeId);
    },
    [watchlist]
  );

  // Backward compatibility methods
  const updateRating = useCallback(
    async (animeId: string, rating: number) => {
      await updateItem(animeId, { userRating: rating });
    },
    [updateItem]
  );

  const updateNotes = useCallback(
    async (animeId: string, notes: string) => {
      await updateItem(animeId, { notes });
    },
    [updateItem]
  );

  const togglePrivate = useCallback(
    async (animeId: string, isPrivate: boolean) => {
      await updateItem(animeId, { isPrivate });
    },
    [updateItem]
  );

  const addToWatchlist = useCallback(
    async (anime: AnimeCard) => {
      return addItem(anime, 'PLAN_TO_WATCH');
    },
    [addItem]
  );

  const removeItem = useCallback(
    async (animeId: string) => {
      return removeFromWatchlist(animeId);
    },
    [removeFromWatchlist]
  );

  return {
    watchlist,
    loading,
    error,
    updateStatus,
    addItem,
    updateItem,
    updateProgress,
    updateRating,
    updateNotes,
    togglePrivate,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    removeItem,
  };
}
