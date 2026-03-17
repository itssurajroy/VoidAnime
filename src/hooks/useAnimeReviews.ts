'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  where,
  getDocs,
  increment
} from 'firebase/firestore';

export interface AnimeReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  animeId: string;
  animeTitle: string;
  animePoster: string;
  rating: number; // 1-10
  content: string;
  hasSpoilers: boolean;
  likes: number;
  createdAt: any;
  updatedAt: any;
}

export function useAnimeReviews(animeId: string) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [reviews, setReviews] = useState<AnimeReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    if (!firestore || !animeId) {
       
      setReviews([]);
       
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(firestore, 'anime-reviews', animeId, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AnimeReview[];
        setReviews(data);
        
        // Calculate average
        if (data.length > 0) {
          const sum = data.reduce((acc, r) => acc + r.rating, 0);
          setAverageRating(sum / data.length);
          setTotalReviews(data.length);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, animeId]);

  const addReview = useCallback(async (
    animeTitle: string,
    animePoster: string,
    rating: number,
    content: string,
    hasSpoilers: boolean = false
  ) => {
    if (!user || !firestore || !animeId) {
      throw new Error('Cannot add review');
    }

    const reviewData = {
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      userAvatar: user.photoURL || '',
      animeId,
      animeTitle,
      animePoster,
      rating,
      content,
      hasSpoilers,
      likes: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(firestore, 'anime-reviews', animeId, 'reviews'), reviewData);
    
    // Also save to user's reviews collection
    await addDoc(collection(firestore, 'users', user.uid, 'reviews'), {
      ...reviewData,
      reviewId: null, // Will be updated after creation
    });
  }, [user, firestore, animeId]);

  const updateReview = useCallback(async (
    reviewId: string,
    rating: number,
    content: string,
    hasSpoilers: boolean
  ) => {
    if (!user || !firestore || !animeId) {
      throw new Error('Cannot update review');
    }

    await updateDoc(doc(firestore, 'anime-reviews', animeId, 'reviews', reviewId), {
      rating,
      content,
      hasSpoilers,
      updatedAt: serverTimestamp(),
    });
  }, [user, firestore, animeId]);

  const deleteReview = useCallback(async (reviewId: string) => {
    if (!user || !firestore || !animeId) {
      throw new Error('Cannot delete review');
    }

    await deleteDoc(doc(firestore, 'anime-reviews', animeId, 'reviews', reviewId));
  }, [user, firestore, animeId]);

  const likeReview = useCallback(async (reviewId: string) => {
    if (!user || !firestore || !animeId) return;

    const reviewRef = doc(firestore, 'anime-reviews', animeId, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      likes: increment(1)
    });
  }, [user, firestore, animeId]);

  const getUserReview = useCallback(() => {
    if (!user) return null;
    return reviews.find(r => r.userId === user.uid) || null;
  }, [reviews, user]);

  return {
    reviews,
    loading,
    error,
    averageRating,
    totalReviews,
    addReview,
    updateReview,
    deleteReview,
    likeReview,
    getUserReview,
  };
}
