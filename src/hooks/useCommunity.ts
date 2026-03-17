'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit as firestoreLimit, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  where,
  increment
} from 'firebase/firestore';

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  category: string;
  image?: string;
  createdAt: any;
  updatedAt: any;
  likes: number;
  commentsCount: number;
  isPinned: boolean;
  isAdmin: boolean;
  isHidden?: boolean;
  reportCount?: number;
}

export function useCommunity(categoryFilter: string = 'all') {
  const { user } = useUser();
  const firestore = useFirestore();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const postsRef = collection(firestore, 'community_posts');
    let q;

    const baseConstraints = [orderBy('createdAt', 'desc'), firestoreLimit(50)];

    if (categoryFilter === 'all') {
      q = query(postsRef, ...baseConstraints);
    } else {
      q = query(
        postsRef, 
        where('category', '==', categoryFilter),
        ...baseConstraints
      );
    }

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CommunityPost[];
        
        // Sort pinned posts to the top
        fetchedPosts.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return 0;
        });

        setPosts(fetchedPosts);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching community posts:', err);
        setError('Failed to load posts');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, categoryFilter]);

  const addPost = useCallback(async (title: string, content: string, category: string, isAdminStatus: boolean = false, imageUrl?: string) => {
    if (!user || !firestore || !title.trim() || !content.trim()) {
      throw new Error('Cannot add post');
    }

    const postData = {
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      userAvatar: user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid,
      title: title.trim(),
      content: content.trim(),
      category,
      image: imageUrl || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      commentsCount: 0,
      isPinned: false,
      isAdmin: isAdminStatus,
      isHidden: false,
      reportCount: 0,
    };

    const docRef = await addDoc(collection(firestore, 'community_posts'), postData);
    return docRef.id;
  }, [user, firestore]);

  const deletePost = useCallback(async (postId: string) => {
    if (!user || !firestore) {
      throw new Error('Cannot delete post');
    }

    await deleteDoc(doc(firestore, 'community_posts', postId));
  }, [user, firestore]);

  const updatePost = useCallback(async (postId: string, newTitle: string, newContent: string, imageUrl?: string) => {
    if (!user || !firestore || !newTitle.trim() || !newContent.trim()) {
      throw new Error('Cannot update post');
    }

    const postRef = doc(firestore, 'community_posts', postId);
    await updateDoc(postRef, {
      title: newTitle.trim(),
      content: newContent.trim(),
      image: imageUrl || null,
      updatedAt: serverTimestamp(),
    });
  }, [user, firestore]);

  const likePost = useCallback(async (postId: string) => {
    if (!user || !firestore) return;

    const postRef = doc(firestore, 'community_posts', postId);
    await updateDoc(postRef, {
      likes: increment(1)
    });
  }, [user, firestore]);

  const togglePin = useCallback(async (postId: string, currentPinStatus: boolean) => {
    if (!user || !firestore) return;
    const postRef = doc(firestore, 'community_posts', postId);
    await updateDoc(postRef, {
      isPinned: !currentPinStatus,
      updatedAt: serverTimestamp(),
    });
  }, [user, firestore]);

  const hidePost = useCallback(async (postId: string, currentHiddenStatus: boolean) => {
    if (!user || !firestore) return;
    const postRef = doc(firestore, 'community_posts', postId);
    await updateDoc(postRef, {
      isHidden: !currentHiddenStatus,
      updatedAt: serverTimestamp(),
    });
  }, [user, firestore]);

  const reportPost = useCallback(async (postId: string) => {
    if (!user || !firestore) return;
    const postRef = doc(firestore, 'community_posts', postId);
    await updateDoc(postRef, {
      reportCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  }, [user, firestore]);

  return {
    posts,
    loading,
    error,
    addPost,
    deletePost,
    updatePost,
    likePost,
    togglePin,
    hidePost,
    reportPost
  };
}
