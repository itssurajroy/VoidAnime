'use client';
import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
  username: string;
  bio: string;
  coverBanner: string;
  createdAt: string;
  theme: 'dark' | 'light';
  notifications: {
    emailNewEpisodes: boolean;
    emailNewComments: boolean;
    emailNewsletter: boolean;
    pushNewEpisodes: boolean;
    pushNewComments: boolean;
    pushReplies: boolean;
    profileInteractions: boolean;
    episodeUpdates: boolean;
  };
}

const defaultProfile: UserProfile = {
  username: '',
  bio: '',
  coverBanner: '',
  createdAt: '',
  theme: 'dark',
  notifications: {
    emailNewEpisodes: true,
    emailNewComments: true,
    emailNewsletter: false,
    pushNewEpisodes: true,
    pushNewComments: true,
    pushReplies: true,
    profileInteractions: true,
    episodeUpdates: true,
  },
};

export function useUserProfile() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) {
       
      setProfile(defaultProfile);
       
      setLoading(false);
      return;
    }

    const profileRef = doc(firestore, 'users', user.uid);
    
    const unsubscribe = onSnapshot(profileRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfile;
        setProfile({ ...defaultProfile, ...data });
      } else {
        // Create initial profile
        const initialProfile = {
          ...defaultProfile,
          username: user.displayName || user.email?.split('@')[0] || '',
          createdAt: new Date().toISOString(),
        };
        setDoc(profileRef, initialProfile);
        setProfile(initialProfile);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching profile:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user || !firestore) return;

    const profileRef = doc(firestore, 'users', user.uid);
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }, [user, firestore]);

  const updateUsername = useCallback(async (username: string) => {
    await updateProfile({ username });
  }, [updateProfile]);

  const updateBio = useCallback(async (bio: string) => {
    await updateProfile({ bio });
  }, [updateProfile]);

  const updateCoverBanner = useCallback(async (coverBanner: string) => {
    await updateProfile({ coverBanner });
  }, [updateProfile]);

  const updateTheme = useCallback(async (theme: 'dark' | 'light') => {
    await updateProfile({ theme });
  }, [updateProfile]);

  const updateNotifications = useCallback(async (notifications: UserProfile['notifications']) => {
    await updateProfile({ notifications });
  }, [updateProfile]);

  return {
    profile,
    loading,
    updateProfile,
    updateUsername,
    updateBio,
    updateCoverBanner,
    updateTheme,
    updateNotifications,
  };
}
