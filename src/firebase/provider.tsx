'use client';

 

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Firestore, increment, arrayUnion } from 'firebase/firestore';
import { Auth, User, onIdTokenChanged } from 'firebase/auth';
import { Messaging } from 'firebase/messaging';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { useRouter, usePathname } from 'next/navigation';
import { logger } from '@/lib/logger';
import { calculateLevel } from '@/types/gamification';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage?: FirebaseStorage | null;
  messaging?: Messaging | null;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  storage: FirebaseStorage | null;
  messaging: Messaging | null;
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  messaging: Messaging | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { // Renamed from UserAuthHookResult for consistency if desired, or keep as UserAuthHookResult
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
  storage = null,
  messaging = null,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });
  const router = useRouter();
  const pathname = usePathname();

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth || !firestore) {
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    setUserAuthState(prev => ({ ...prev, isUserLoading: true, userError: null }));

    const unsubscribe = onIdTokenChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          // Sync session cookie
          try {
            const token = await firebaseUser.getIdToken();
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: token }),
            });
          } catch (error) {
            logger.error("Error updating session cookie", error);
          }

          // Create or update user document in Firestore
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          try {
            const docSnap = await getDoc(userDocRef);
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@voidanime.online';
            
            if (!docSnap.exists()) {
              const isAdminEmail = firebaseUser.email === adminEmail;
              await setDoc(userDocRef, {
                id: firebaseUser.uid,
                email: firebaseUser.email,
                username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || `user_${firebaseUser.uid.substring(0, 6)}`,
                role: isAdminEmail ? 'SUPER_ADMIN' : 'USER',
                status: 'ACTIVE',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
                // Gamification fields
                xp: 0,
                level: 1,
                voidCoins: 0,
                currentStreak: 0,
                longestStreak: 0,
                badges: [],
                dailyXpEarned: 0,
                lastXpResetDate: serverTimestamp(),
              });
            } else {
              const userData = docSnap.data();
              const isAdminEmail = firebaseUser.email === adminEmail;
              const lastLogin = userData.lastLoginAt?.toDate() || new Date(0);
              const now = new Date();
              const updates: any = { lastLoginAt: serverTimestamp() };

              if (isAdminEmail && userData.role !== 'SUPER_ADMIN') {
                updates.role = 'SUPER_ADMIN';
              }

              // Check Daily Login
              if (now.getDate() !== lastLogin.getDate() || now.getMonth() !== lastLogin.getMonth() || now.getFullYear() !== lastLogin.getFullYear()) {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);

                const isConsecutive = lastLogin.getDate() === yesterday.getDate() &&
                  lastLogin.getMonth() === yesterday.getMonth() &&
                  lastLogin.getFullYear() === yesterday.getFullYear();

                const newStreak = isConsecutive ? (userData.currentStreak || 0) + 1 : 1;
                const longestStreak = Math.max(newStreak, userData.longestStreak || 0);

                updates.currentStreak = newStreak;
                updates.longestStreak = longestStreak;

                const currentXp = userData.xp || 0;
                const streakBonus = newStreak > 1 ? (newStreak * 5) : 0; 
                const amountToAward = 20 + Math.min(streakBonus, 50);

                const newXp = currentXp + amountToAward;
                const newLevel = calculateLevel(newXp);

                updates.xp = newXp;
                if (newLevel > (userData.level || 1)) {
                  updates.level = newLevel;
                }

                if (newStreak >= 7 && !(userData.badges || []).includes('week_streak')) {
                  updates.badges = arrayUnion('week_streak');
                }

                const historyRef = doc(firestore, 'users', firebaseUser.uid, 'xpHistory', `${Date.now()}`);
                await setDoc(historyRef, {
                  amount: amountToAward,
                  reason: newStreak > 1 ? `Daily Login Bonus (${newStreak}x Streak)` : 'Daily Login Bonus',
                  timestamp: serverTimestamp()
                });
              }

              await updateDoc(userDocRef, updates);
            }
          } catch (error) {
            logger.error("FirebaseProvider: Error managing user document:", error);
          }
        } else {
          // Clear session cookie on logout
          try {
            await fetch('/api/auth/session', { method: 'DELETE' });
          } catch (error) {
            logger.error("Error clearing session cookie", error);
          }
        }

        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
      },
      (error) => {
        logger.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
      }
    );
    return () => unsubscribe();
  }, [auth, firestore]);

  // Handle new user redirect
  useEffect(() => {
    if (userAuthState.user && !userAuthState.isUserLoading) {
      const { creationTime, lastSignInTime } = userAuthState.user.metadata;
      if (creationTime && lastSignInTime) {
        const isNewUser = new Date(lastSignInTime).getTime() - new Date(creationTime).getTime() < 5000;
        if (isNewUser && !userAuthState.user.displayName && pathname !== '/welcome') {
          router.push('/welcome');
        }
      }
    }
  }, [userAuthState.user, userAuthState.isUserLoading, pathname, router]);

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      storage: servicesAvailable ? storage : null,
      messaging: servicesAvailable ? messaging : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, storage, messaging, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Returns null services if Firebase is not available instead of throwing.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    return {
      firebaseApp: null as unknown as FirebaseApp,
      firestore: null as unknown as Firestore,
      auth: null as unknown as Auth,
      storage: null as unknown as FirebaseStorage,
      messaging: null,
      user: null,
      isUserLoading: false,
      userError: null,
    };
  }

  return {
    firebaseApp: context.firebaseApp as FirebaseApp,
    firestore: context.firestore as Firestore,
    auth: context.auth as Auth,
    storage: context.storage as FirebaseStorage,
    messaging: context.messaging,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth | null => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore | null => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Storage instance. */
export const useStorage = (): FirebaseStorage | null => {
  const { storage } = useFirebase();
  return storage;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp | null => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase<T> = T & { __memo?: boolean };

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  // eslint-disable-next-line react-hooks/use-memo, react-hooks/exhaustive-deps
  const memoized = useMemo(factory, deps);

  if (typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;

  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * Returns null user if Firebase is not available.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const { user, isUserLoading, userError } = useFirebase();
  return { user, isUserLoading, userError };
};
