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

import { createNotification } from '@/actions/notifications';
import { checkSpam } from '@/lib/spam-guard';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: any;
  updatedAt: any;
  likes: number;
  parentId: string | null;
  isHidden: boolean;
  editCount?: number;
  animeTitle?: string;
}

export function useComments(animeId: string) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spamError, setSpamError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore || !animeId) {
       
      setComments([]);
       
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(firestore, 'comments', animeId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[];
        setComments(data.filter(c => !c.isHidden));
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, animeId]);

  const addComment = useCallback(async (content: string, animeTitle: string, parentId: string | null = null) => {
    if (!user || !firestore || !content.trim() || !animeId) {
      throw new Error('Cannot add comment');
    }

    setSpamError(null);
    const spamCheck = checkSpam(content, comments, user.uid);
    if (spamCheck.isSpam) {
      setSpamError(spamCheck.reason || "Your comment has been flagged as spam.");
      return;
    }

    const commentData = {
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
      userAvatar: user.photoURL || '',
      content: content.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likes: 0,
      parentId,
      isHidden: false,
      editCount: 0,
      animeTitle,
    };

    const docRef = await addDoc(collection(firestore, 'comments', animeId, 'messages'), commentData);

    // If it's a reply, notify the parent comment owner
    if (parentId) {
      const parentComment = comments.find(c => c.id === parentId);
      if (parentComment && parentComment.userId !== user.uid) {
        await createNotification({
          recipientId: parentComment.userId,
          senderId: user.uid,
          senderName: user.displayName,
          senderAvatar: user.photoURL,
          type: 'COMMENT_REPLY',
          title: 'New Reply',
          content: `${user.displayName || 'Someone'} replied to your comment on ${animeTitle}`,
          link: `/watch/${animeId}`,
        });
      }
    }
  }, [user, firestore, animeId, comments]);

  const updateComment = useCallback(async (commentId: string, newContent: string) => {
    if (!user || !firestore || !animeId) {
      throw new Error('Cannot update comment');
    }

    const commentRef = doc(firestore, 'comments', animeId, 'messages', commentId);
    await updateDoc(commentRef, {
      content: newContent.trim(),
      updatedAt: serverTimestamp(),
      editCount: increment(1),
    });
  }, [user, firestore, animeId]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!user || !firestore || !animeId) {
      throw new Error('Cannot delete comment');
    }

    await deleteDoc(doc(firestore, 'comments', animeId, 'messages', commentId));
  }, [user, firestore, animeId]);

  const likeComment = useCallback(async (commentId: string) => {
    if (!user || !firestore || !animeId) return;

    const commentRef = doc(firestore, 'comments', animeId, 'messages', commentId);
    await updateDoc(commentRef, {
      likes: increment(1)
    });

    const comment = comments.find(c => c.id === commentId);
    if (comment && comment.userId !== user.uid) {
        await createNotification({
          recipientId: comment.userId,
          senderId: user.uid,
          senderName: user.displayName,
          senderAvatar: user.photoURL,
          type: 'COMMENT_LIKE',
          title: 'Comment Liked',
          content: `${user.displayName || 'Someone'} liked your comment on ${comment.animeTitle || 'an anime'}`,
          link: `/watch/${animeId}`,
        });
    }
  }, [user, firestore, animeId, comments]);

  const hideComment = useCallback(async (commentId: string) => {
    if (!firestore || !animeId) return;
    
    await updateDoc(doc(firestore, 'comments', animeId, 'messages', commentId), {
      isHidden: true
    });
  }, [firestore, animeId]);

  const getReplies = useCallback((parentId: string) => {
    return comments.filter(c => c.parentId === parentId);
  }, [comments]);

  return {
    comments,
    loading,
    error,
    spamError,
    setSpamError,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    hideComment,
    getReplies,
  };
}
