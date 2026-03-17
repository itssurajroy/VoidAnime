import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';
import { GamificationProfile } from '@/types/gamification';

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string;
  gamification: GamificationProfile;
}

interface UserState {
  firebaseUser: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  profile: UserProfile | null;
  isPro: boolean;
  setFirebaseUser: (user: UserState['firebaseUser']) => void;
  setProfile: (profile: UserProfile | null) => void;
  setUser: (profile: UserProfile | null) => void;
  setPro: (isPro: boolean) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      profile: null,
      isPro: false,
      isLoading: true,
      setFirebaseUser: (user) => set({ firebaseUser: user }),
      setProfile: (profile) => set({ profile }),
      setUser: (profile) => set({ profile }),
      setPro: (isPro) => set({ isPro }),
      setLoading: (isLoading) => set({ isLoading }),
      clearUser: () => set({ firebaseUser: null, profile: null, isPro: false }),
    }),
    {
      name: 'user-storage',
    }
  )
);
