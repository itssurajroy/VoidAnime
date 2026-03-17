'use client';

import { useEffect } from 'react';
import { onAuth } from '@/lib/firebase/auth';
import { getUserProfile, upsertUserProfile } from '@/lib/firebase/firestore';
import { useUserStore } from '@/store/userStore';
import { useListStore } from '@/store/listStore';
import { getUserList } from '@/lib/firebase/firestore';
import { UserProfile as StoreUserProfile } from '@/store/userStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setFirebaseUser, setUser, setLoading, clearUser } = useUserStore();
  const { setEntries, clearList } = useListStore();

  useEffect(() => {
    const unsub = onAuth(async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });

        try {
          // Ensure user profile exists in Firestore
          let profile = await getUserProfile(firebaseUser.uid);
          if (!profile) {
            const username =
              (firebaseUser.displayName ?? firebaseUser.email ?? firebaseUser.uid)
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000);
            await upsertUserProfile(firebaseUser.uid, {
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              displayName: firebaseUser.displayName ?? 'Anime Fan',
              username,
              photoURL: firebaseUser.photoURL ?? '',
              isPro: false,
            });
            profile = await getUserProfile(firebaseUser.uid);
          }
          setUser(profile as StoreUserProfile);

          // Load list
          const list = await getUserList(firebaseUser.uid);
          setEntries(list as any);
        } catch (e) {
          console.error('[AuthProvider] Error:', e);
        }
      } else {
        clearUser();
        clearList();
      }
      setLoading(false);
    });

    return () => unsub();
  }, [setFirebaseUser, setUser, setLoading, clearUser, setEntries, clearList]);

  return <>{children}</>;
}
