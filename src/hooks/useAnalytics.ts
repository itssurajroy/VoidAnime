'use client';

import { useCallback, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent, trackPageView } from '@/lib/ga';

type AnalyticsEvent = {
  event: string;
  data?: Record<string, string | number | boolean | null>;
};

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url, document.title);
  }, [pathname, searchParams]);

  const track = useCallback(async (event: string, data?: Record<string, string | number | boolean | null>) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, data }),
      });
      
      trackEvent(event, data);
    } catch (error) {
      console.error('Analytics track error:', error);
    }
  }, []);

  const trackEpisodeWatch = useCallback((animeId: string, animeTitle: string, episodeId: string, episodeNumber: number) => {
    track('episode_watch_start', {
      animeId,
      animeTitle,
      episodeId,
      episodeNumber,
    });
  }, [track]);

  const trackEpisodeComplete = useCallback((animeId: string, animeTitle: string, episodeNumber: number, watchDuration: number) => {
    track('episode_watch_complete', {
      animeId,
      animeTitle,
      episodeNumber,
      watchDuration,
    });
  }, [track]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    track('search_query', {
      query,
      resultsCount,
    });
  }, [track]);

  const trackAnimeClick = useCallback((animeId: string, animeTitle: string, source: string) => {
    track('anime_click', {
      animeId,
      animeTitle,
      source,
    });
  }, [track]);

  const trackWatchRoomCreate = useCallback((roomId: string, animeId: string, animeTitle: string) => {
    track('watch_room_create', {
      roomId,
      animeId,
      animeTitle,
    });
  }, [track]);

  const trackWatchRoomJoin = useCallback((roomId: string, animeId: string, role: 'host' | 'participant') => {
    track('watch_room_join', {
      roomId,
      animeId,
      role,
    });
  }, [track]);

  const trackSignup = useCallback((method: string) => {
    track('signup', { method });
  }, [track]);

  const trackLogin = useCallback((method: string) => {
    track('login', { method });
  }, [track]);

  const trackShare = useCallback((contentType: 'anime' | 'episode', contentId: string, platform: string) => {
    track('share', {
      contentType,
      contentId,
      platform,
    });
  }, [track]);

  return {
    track,
    trackEpisodeWatch,
    trackEpisodeComplete,
    trackSearch,
    trackAnimeClick,
    trackWatchRoomCreate,
    trackWatchRoomJoin,
    trackSignup,
    trackLogin,
    trackShare,
  };
}
