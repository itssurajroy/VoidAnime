'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy, limit, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import type { AnimeCard } from '@/types';
import { sanitizeForFirestore } from '@/lib/firebase-utils';

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
  const { user } = useUser();
  const firestore = useFirestore();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) {
       
      setHistory([]);
       
      setLoading(false);
      return;
    }

    const q = query(
      collection(firestore, 'users', user.uid, 'watchHistory'),
      orderBy('watchedAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as WatchHistoryItem);
      setHistory(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching watch history:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore]);

  const addToHistory = useCallback(async (
    anime: AnimeCard,
    episodeNumber: number,
    episodeId: string
  ) => {
    if (!user || !firestore) return;

    const historyItem: any = {
      animeId: anime.id,
      animeName: anime.name,
      animePoster: anime.poster,
      episodeNumber,
      episodeId,
      watchedAt: serverTimestamp(),
      progress: 0,
      duration: 0,
    };

    const historyRef = doc(firestore, 'users', user.uid, 'watchHistory', episodeId);
    await setDoc(historyRef, historyItem, { merge: true });

    const watchlistRef = doc(firestore, 'users', user.uid, 'watchlist', anime.id);
    await setDoc(watchlistRef, sanitizeForFirestore({
      ...anime,
      status: 'WATCHING',
      progress: episodeNumber,
      totalEpisodes: anime.episodes?.sub || anime.episodes?.dub || 0,
      updatedAt: new Date().toISOString(),
    }), { merge: true });
  }, [user, firestore]);

  const clearHistory = useCallback(async () => {
    if (!user || !firestore) return;

    const q = query(
      collection(firestore, 'users', user.uid, 'watchHistory'),
      orderBy('watchedAt', 'desc'),
      limit(50)
    );

    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }, [user, firestore]);

  return { history, loading, addToHistory, clearHistory };
}

export function useWatchProgress(animeId: string, episodeId: string) {
  const { user } = useUser();
  const firestore = useFirestore();

  const updateProgress = useCallback(async (progress: number, duration: number) => {
    if (!user || !firestore || !animeId || !episodeId) return;

    const historyRef = doc(firestore, 'users', user.uid, 'watchHistory', episodeId);

    try {
      await setDoc(historyRef, {
        animeId,
        episodeId,
        progress,
        duration,
        watchedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Error updating watch progress: ", error);
    }
  }, [user, firestore, animeId, episodeId]);

  return { updateProgress };
}
