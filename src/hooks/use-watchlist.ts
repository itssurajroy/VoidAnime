'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import type { WatchlistItem, WatchlistStatus, AnimeCard } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { sanitizeForFirestore } from '@/lib/firebase-utils';

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

export function useWatchlist() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [watchlist, setWatchlist] = useState<EnhancedWatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !firestore) {
             
            setWatchlist([]);
             
            setLoading(false);
            return;
        }
        
        const q = collection(firestore, 'users', user.uid, 'watchlist');
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnhancedWatchlistItem));
            setWatchlist(data);
            setLoading(false);
        }, (error) => {
            logger.error('[Watchlist] Error fetching watchlist:', error);
            toast({ 
                variant: 'destructive', 
                title: 'Error loading watchlist', 
                description: error.message 
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, firestore, toast]);
    
    const updateStatus = useCallback(async (animeId: string, status: WatchlistStatus) => {
        if (!user || !firestore) {
            return;
        }
        
        const docRef = doc(firestore, 'users', user.uid, 'watchlist', animeId);
        const updates: any = { 
            status,
            updatedAt: new Date().toISOString(),
        };
        
        // Only set startedAt if it's the first time moving to 'WATCHING'
        if (status === 'WATCHING' && !watchlist.find(item => item.id === animeId)?.startedAt) {
            updates.startedAt = new Date().toISOString();
        }
        if (status === 'COMPLETED') {
            updates.finishedAt = new Date().toISOString();
        }
        
        try {
            await updateDoc(docRef, updates);
            toast({ 
                title: 'Watchlist updated!',
                description: `Moved to "${status.replace(/_/g, ' ')}".`
            });
        } catch (error: any) {
            logger.error('[Watchlist] Error updating status:', error);
            toast({ variant: 'destructive', title: 'Error updating status', description: error.message });
        }
    }, [user, firestore, toast, watchlist]);
    
    const removeItem = useCallback(async (animeId: string) => {
        if (!user || !firestore) return;
        
        const docRef = doc(firestore, 'users', user.uid, 'watchlist', animeId);
        try {
            await deleteDoc(docRef);
            toast({ title: 'Removed from watchlist' });
        } catch (error: any) {
            logger.error('[Watchlist] Error removing item:', error);
            toast({ variant: 'destructive', title: 'Error removing item', description: error.message });
        }
    }, [user, firestore, toast]);

    const addItem = useCallback(async (anime: AnimeCard, status: WatchlistStatus) => {
        if (!user || !firestore) {
            return;
        }
        
        const docRef = doc(firestore, 'users', user.uid, 'watchlist', anime.id);
        const newItem = sanitizeForFirestore({
            userId: user.uid,
            name: anime.name,
            jname: anime.jname,
            poster: anime.poster,
            type: anime.type,
            rating: anime.rating,
            duration: anime.duration,
            episodes: anime.episodes,
            status,
            progress: 0,
            totalEpisodes: anime.episodes?.sub || anime.episodes?.dub || 0,
            addedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...(status === 'WATCHING' && { startedAt: new Date().toISOString() }),
        });
        
        try {
            await setDoc(docRef, newItem);
            toast({ 
                title: 'Added to watchlist!',
                description: `Added to "${status.replace(/_/g, ' ')}".`
            });
        } catch (error: any) {
            logger.error('[Watchlist] Error adding item:', error);
            toast({ variant: 'destructive', title: 'Error adding item', description: error.message });
        }
    }, [user, firestore, toast]);

    const updateProgress = useCallback(async (animeId: string, progress: number) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, 'users', user.uid, 'watchlist', animeId);
        await updateDoc(docRef, { 
            progress,
            updatedAt: new Date().toISOString(),
        });
    }, [user, firestore]);

    const updateRating = useCallback(async (animeId: string, rating: number) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, 'users', user.uid, 'watchlist', animeId);
        await updateDoc(docRef, { 
            userRating: rating,
            updatedAt: new Date().toISOString(),
        });
    }, [user, firestore]);

    const updateNotes = useCallback(async (animeId: string, notes: string) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, 'users', user.uid, 'watchlist', animeId);
        await updateDoc(docRef, { 
            notes,
            updatedAt: new Date().toISOString(),
        });
    }, [user, firestore]);

    const togglePrivate = useCallback(async (animeId: string, isPrivate: boolean) => {
        if (!user || !firestore) return;
        const docRef = doc(firestore, 'users', user.uid, 'watchlist', animeId);
        await updateDoc(docRef, { 
            isPrivate,
            updatedAt: new Date().toISOString(),
        });
    }, [user, firestore]);

    const isInWatchlist = useCallback((animeId: string) => {
        return watchlist.some(item => item.id === animeId);
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
        updateStatus, 
        removeItem, 
        addItem,
        updateProgress,
        updateRating,
        updateNotes,
        togglePrivate,
        isInWatchlist,
        addToWatchlist,
        removeFromWatchlist,
    };
}
