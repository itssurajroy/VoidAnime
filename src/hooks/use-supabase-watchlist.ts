'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from "@supabase/ssr";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';
import type { WatchlistStatus, AnimeCard } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export interface WatchlistItem {
  id: string;
  anime_id: string;
  anime_title: string;
  anime_poster: string | null;
  status: WatchlistStatus;
  progress: number;
  total_episodes: number;
  rating: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useWatchlist() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    const fetchWatchlist = async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        toast({ 
          variant: 'destructive', 
          title: 'Error loading watchlist', 
          description: error.message 
        });
      } else {
        setWatchlist(data || []);
      }
      setLoading(false);
    };

    fetchWatchlist();

    const channel = supabase
      .channel('watchlist_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'watchlist',
        filter: `user_id=eq.${user.id}`
      }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setWatchlist(prev => [payload.new as WatchlistItem, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setWatchlist(prev => prev.map(item => 
            item.id === payload.new.id ? payload.new as WatchlistItem : item
          ));
        } else if (payload.eventType === 'DELETE') {
          setWatchlist(prev => prev.filter(item => item.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const addItem = useCallback(async (anime: AnimeCard, status: WatchlistStatus = 'PLAN_TO_WATCH') => {
    if (!user) return;

    const { error } = await supabase.from('watchlist').insert({
      user_id: user.id,
      anime_id: anime.id,
      anime_title: anime.name,
      anime_poster: anime.poster,
      status,
      progress: 0,
      total_episodes: anime.episodes?.sub || anime.episodes?.dub || 0,
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Error adding to watchlist', description: error.message });
    } else {
      toast({ title: 'Added to watchlist!', description: `Added to "${status.replace(/_/g, ' ')}".` });
    }
  }, [user, toast]);

  const removeItem = useCallback(async (animeId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('anime_id', animeId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error removing from watchlist', description: error.message });
    } else {
      toast({ title: 'Removed from watchlist' });
    }
  }, [user, toast]);

  const updateStatus = useCallback(async (animeId: string, status: WatchlistStatus) => {
    if (!user) return;

    const { error } = await supabase
      .from('watchlist')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('anime_id', animeId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error updating status', description: error.message });
    } else {
      toast({ title: 'Watchlist updated!', description: `Moved to "${status.replace(/_/g, ' ')}".` });
    }
  }, [user, toast]);

  const updateProgress = useCallback(async (animeId: string, progress: number) => {
    if (!user) return;

    await supabase
      .from('watchlist')
      .update({ progress, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('anime_id', animeId);
  }, [user]);

  const updateRating = useCallback(async (animeId: string, rating: number) => {
    if (!user) return;

    await supabase
      .from('watchlist')
      .update({ rating, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('anime_id', animeId);
  }, [user]);

  const isInWatchlist = useCallback((animeId: string) => {
    return watchlist.some(item => item.anime_id === animeId);
  }, [watchlist]);

  const addToWatchlist = useCallback(async (anime: AnimeCard) => {
    return addItem(anime, 'PLAN_TO_WATCH');
  }, [addItem]);

  const removeFromWatchlist = useCallback(async (animeId: string) => {
    return removeItem(animeId);
  }, [removeItem]);

  return {
    watchlist,
    loading,
    addItem,
    removeItem,
    updateStatus,
    updateProgress,
    updateRating,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
  };
}
