'use client';
import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from "@supabase/ssr";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

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
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const mapProfile = (data: any): UserProfile => {
    return {
      username: data.username || '',
      bio: data.bio || '',
      coverBanner: data.cover_banner || '', // If it's added to DB later
      createdAt: data.created_at || '',
      theme: data.theme || 'dark',
      notifications: data.notifications || defaultProfile.notifications,
    };
  };

  useEffect(() => {
    if (!user) {
      setProfile(defaultProfile);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(mapProfile(data));
      }
      setLoading(false);
    };

    fetchProfile();

    const channel = supabase
      .channel(`user_profile_${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`
      }, (payload) => {
        setProfile(mapProfile(payload.new));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;

    // Map UserProfile fields to DB columns
    const dbUpdates: any = {
      updated_at: new Date().toISOString(),
    };
    
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    // Note: If you add theme, notifications, cover_banner to your Supabase schema,
    // you can uncomment these lines:
    // if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
    // if (updates.notifications !== undefined) dbUpdates.notifications = updates.notifications;
    // if (updates.coverBanner !== undefined) dbUpdates.cover_banner = updates.coverBanner;

    const { error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
    }
  }, [user]);

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
