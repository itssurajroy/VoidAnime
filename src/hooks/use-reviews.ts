'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, orderBy, limit, addDoc, updateDoc } from 'firebase/firestore';

export interface UserReview {
  id: string;
  animeId: string;
  animeTitle: string;
  animePoster: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function useReviews() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) {
       
      setReviews([]);
       
      setLoading(false);
      return;
    }

    const q = query(
      collection(firestore, 'users', user.uid, 'reviews'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserReview[];
      setReviews(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore]);

  const addReview = useCallback(async (
    animeId: string,
    animeTitle: string,
    animePoster: string,
    rating: number,
    content: string
  ) => {
    if (!user || !firestore) return;

    const review: Omit<UserReview, 'id'> = {
      animeId,
      animeTitle,
      animePoster,
      rating,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addDoc(collection(firestore, 'users', user.uid, 'reviews'), review);
  }, [user, firestore]);

  const updateReview = useCallback(async (
    reviewId: string,
    rating: number,
    content: string
  ) => {
    if (!user || !firestore) return;

    await updateDoc(doc(firestore, 'users', user.uid, 'reviews', reviewId), {
      rating,
      content,
      updatedAt: new Date().toISOString(),
    });
  }, [user, firestore]);

  const deleteReview = useCallback(async (reviewId: string) => {
    if (!user || !firestore) return;

    await deleteDoc(doc(firestore, 'users', user.uid, 'reviews', reviewId));
  }, [user, firestore]);

  return { reviews, loading, addReview, updateReview, deleteReview };
}
