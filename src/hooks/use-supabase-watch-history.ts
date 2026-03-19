'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from "@supabase/ssr";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export interface WatchHistoryItem {
  id: string;
  anime_id: string;
  anime_title: string;
  anime_poster: string | null;
  episode_id: string | null;
  episode_number: number;
  provider: string;
  progress: number;
  duration: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useWatchHistory() {
  const { user } = useSupabaseAuth();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(100);

    if (!error) {
      setHistory(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const addToHistory = useCallback(async (
    animeId: string,
    animeTitle: string,
    animePoster: string | null,
    episodeNumber: number,
    episodeId?: string,
    provider: string = 'kaido',
    progress: number = 0,
    duration: number = 0,
    completed: boolean = false
  ) => {
    if (!user) return;

    const { data: existing } = await supabase
      .from('watch_history')
      .select('id')
      .eq('user_id', user.id)
      .eq('anime_id', animeId)
      .eq('episode_number', episodeNumber)
      .single();

    if (existing) {
      await supabase
        .from('watch_history')
        .update({
          progress,
          duration,
          completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('watch_history')
        .insert({
          user_id: user.id,
          anime_id: animeId,
          anime_title: animeTitle,
          anime_poster: animePoster,
          episode_id: episodeId,
          episode_number: episodeNumber,
          provider,
          progress,
          duration,
          completed
        });
    }

    fetchHistory();
  }, [user, fetchHistory]);

  const updateProgress = useCallback(async (
    animeId: string,
    episodeNumber: number,
    progress: number,
    completed: boolean = false
  ) => {
    if (!user) return;

    await supabase
      .from('watch_history')
      .update({ progress, completed, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('anime_id', animeId)
      .eq('episode_number', episodeNumber);
  }, [user]);

  const clearHistory = useCallback(async () => {
    if (!user) return;

    await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', user.id);

    setHistory([]);
  }, [user]);

  const getLastWatched = useCallback((animeId: string): WatchHistoryItem | undefined => {
    return history.find(h => h.anime_id === animeId);
  }, [history]);

  const getEpisodeProgress = useCallback((animeId: string, episodeNumber: number): WatchHistoryItem | undefined => {
    return history.find(h => h.anime_id === animeId && h.episode_number === episodeNumber);
  }, [history]);

  return {
    history,
    loading,
    addToHistory,
    updateProgress,
    clearHistory,
    getLastWatched,
    getEpisodeProgress,
    refetch: fetchHistory
  };
}
