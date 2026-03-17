'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import type { AnimeCard } from '@/types';
import { sanitizeForFirestore } from '@/lib/firebase-utils';

export interface FavoriteItem extends AnimeCard {
  addedAt: string;
}

export function useFavorites() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) {
       
      setFavorites([]);
       
      setLoading(false);
      return;
    }

    const q = query(
      collection(firestore, 'users', user.uid, 'favorites'),
      orderBy('addedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as FavoriteItem);
      setFavorites(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore]);

  const addFavorite = useCallback(async (anime: AnimeCard) => {
    if (!user || !firestore) return;

    const favorite = sanitizeForFirestore({
      ...anime,
      addedAt: new Date().toISOString(),
    });

    await setDoc(doc(firestore, 'users', user.uid, 'favorites', anime.id), favorite);
  }, [user, firestore]);

  const removeFavorite = useCallback(async (animeId: string) => {
    if (!user || !firestore) return;

    await deleteDoc(doc(firestore, 'users', user.uid, 'favorites', animeId));
  }, [user, firestore]);

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
