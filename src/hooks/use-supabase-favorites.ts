'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from "@supabase/ssr";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useToast } from '@/hooks/use-toast';
import type { AnimeCard } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export interface FavoriteItem {
  id: string;
  anime_id: string;
  anime_title: string;
  anime_poster: string | null;
  anime_rating: string | null;
  created_at: string;
}

export function useFavorites() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setFavorites(data || []);
      }
      setLoading(false);
    };

    fetchFavorites();

    const channel = supabase
      .channel('favorites_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'favorites',
        filter: `user_id=eq.${user.id}`
      }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          setFavorites(prev => [payload.new as FavoriteItem, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setFavorites(prev => prev.filter(item => item.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addFavorite = useCallback(async (anime: AnimeCard) => {
    if (!user) return;

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      anime_id: anime.id,
      anime_title: anime.name,
      anime_poster: anime.poster,
      anime_rating: anime.rating || null
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Error adding to favorites', description: error.message });
    } else {
      toast({ title: 'Added to favorites!' });
    }
  }, [user, toast]);

  const removeFavorite = useCallback(async (animeId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('anime_id', animeId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error removing from favorites', description: error.message });
    } else {
      toast({ title: 'Removed from favorites' });
    }
  }, [user, toast]);

  const toggleFavorite = useCallback(async (anime: AnimeCard) => {
    if (!user) return;
    
    const isFavorited = favorites.some(f => f.anime_id === anime.id);
    if (isFavorited) {
      await removeFavorite(anime.id);
    } else {
      await addFavorite(anime);
    }
  }, [user, favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((animeId: string) => {
    return favorites.some(f => f.anime_id === animeId);
  }, [favorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
