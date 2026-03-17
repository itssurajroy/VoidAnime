'use client';
import { useState, useEffect } from 'react';

export interface PublicProfile {
  exists: boolean;
  username: string;
  uid: string;
  avatarUrl: string | null;
  bio: string | null;
  coverBanner: string | null;
  memberSince: string | null;
  stats: {
    totalAnime: number;
    completed: number;
    episodesWatched: number;
    hoursWatched: number;
  };
  publicFavorites: Array<{
    id: string;
    name: string;
    poster: string;
  }>;
  publicReviews: Array<{
    id: string;
    animeId: string;
    animeTitle: string;
    animePoster: string;
    rating: number;
    content: string;
    createdAt: string;
  }>;
}

export function usePublicProfile(username: string) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/users/${encodeURIComponent(username)}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('User not found');
          } else {
            setError('Failed to load profile');
          }
          setProfile(null);
          return;
        }

        const data = await res.json();
        setProfile(data);
        setError(null);
      } catch (err) {
        setError('Failed to load profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { profile, loading, error };
}
