'use client';
import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from "@supabase/ssr";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { AnimeCard } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export interface WatchHistoryItem {
  animeId: string;
  animeName: string;
  animePoster: string;
  episodeNumber: number;
  episodeId: string;
  watchedAt: any;
  progress: number;
  duration: number;
}

export function useWatchHistory() {
  const { user } = useSupabaseAuth();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const mapHistoryItem = (item: any): WatchHistoryItem => ({
    animeId: item.anime_id,
    animeName: item.anime_title,
    animePoster: item.anime_poster,
    episodeNumber: item.episode_number,
    episodeId: item.episode_id,
    watchedAt: item.updated_at || item.created_at,
    progress: item.progress,
    duration: item.duration,
  });

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching watch history:', error);
      } else {
        setHistory((data || []).map(mapHistoryItem));
      }
      setLoading(false);
    };

    fetchHistory();

    const channel = supabase
      .channel(`watch_history_${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'watch_history',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchHistory();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addToHistory = useCallback(async (
    anime: AnimeCard,
    episodeNumber: number,
    episodeId: string
  ) => {
    if (!user) return;

    // Check if this episode history exists
    const { data: existing } = await supabase
      .from('watch_history')
      .select('id')
      .eq('user_id', user.id)
      .eq('anime_id', anime.id)
      .eq('episode_id', episodeId)
      .single();

    if (existing) {
      await supabase
        .from('watch_history')
        .update({
          episode_number: episodeNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('watch_history').insert({
        user_id: user.id,
        anime_id: anime.id,
        anime_title: anime.name,
        anime_poster: anime.poster,
        episode_number: episodeNumber,
        episode_id: episodeId,
        updated_at: new Date().toISOString()
      });
    }

    // Update Watchlist status to WATCHING
    // Watchlist table HAS a unique constraint (user_id, anime_id)
    await supabase.from('watchlist').upsert({
      user_id: user.id,
      anime_id: anime.id,
      anime_title: anime.name,
      anime_poster: anime.poster,
      status: 'WATCHING',
      progress: episodeNumber,
      total_episodes: anime.episodes?.sub || anime.episodes?.dub || 0,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id, anime_id' });

  }, [user]);

  const clearHistory = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing history:', error);
    }
  }, [user]);

  return { history, loading, addToHistory, clearHistory };
}

export function useWatchProgress(animeId: string, episodeId: string) {
  const { user } = useSupabaseAuth();

  const updateProgress = useCallback(async (progress: number, duration: number) => {
    if (!user || !animeId || !episodeId) return;

    try {
      // Find history entry for this episode
      const { data: existing } = await supabase
        .from('watch_history')
        .select('id')
        .eq('user_id', user.id)
        .eq('anime_id', animeId)
        .eq('episode_id', episodeId)
        .single();

      if (existing) {
        await supabase
          .from('watch_history')
          .update({
            progress: Math.floor(progress),
            duration: Math.floor(duration),
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Just insert if doesn't exist (though it usually should from addToHistory)
        await supabase.from('watch_history').insert({
          user_id: user.id,
          anime_id: animeId,
          episode_id: episodeId,
          episode_number: 0, // Fallback
          progress: Math.floor(progress),
          duration: Math.floor(duration),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error updating watch progress: ", error);
    }
  }, [user, animeId, episodeId]);

  return { updateProgress };
}
