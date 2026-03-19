'use client';
import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from "@supabase/ssr";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { AnimeCard } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export interface FavoriteItem extends AnimeCard {
  addedAt: string;
}

export function useFavorites() {
  const { user } = useSupabaseAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const mapFavoriteItem = (item: any): FavoriteItem => ({
    id: item.anime_id,
    name: item.anime_title,
    poster: item.anime_poster,
    rating: item.anime_rating,
    addedAt: item.created_at,
  } as FavoriteItem);

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

      if (error) {
        console.error('Error fetching favorites:', error);
      } else {
        setFavorites((data || []).map(mapFavoriteItem));
      }
      setLoading(false);
    };

    fetchFavorites();

    const channel = supabase
      .channel(`favorites_${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'favorites',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchFavorites();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addFavorite = useCallback(async (anime: AnimeCard) => {
    if (!user) return;

    const { error } = await supabase.from('favorites').upsert({
      user_id: user.id,
      anime_id: anime.id,
      anime_title: anime.name,
      anime_poster: anime.poster,
      anime_rating: anime.rating?.toString() || null,
    }, { onConflict: 'user_id, anime_id' });

    if (error) {
      console.error('Error adding favorite:', error);
    }
  }, [user]);

  const removeFavorite = useCallback(async (animeId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('anime_id', animeId);

    if (error) {
      console.error('Error removing favorite:', error);
    }
  }, [user]);

  const isFavorite = useCallback((animeId: string): boolean => {
    return favorites.some(f => f.id === animeId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (anime: AnimeCard) => {
    if (isFavorite(anime.id)) {
      await removeFavorite(anime.id);
    } else {
      await addFavorite(anime);
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return { favorites, loading, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
