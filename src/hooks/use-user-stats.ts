'use client';

import { useMemo } from 'react';
import type { WatchlistItem } from '@/types';

export function useUserStats(watchlist: WatchlistItem[]) {
  const stats = useMemo(() => {
    const total = watchlist.length;
    const watching = watchlist.filter(w => w.status === 'WATCHING').length;
    const completed = watchlist.filter(w => w.status === 'COMPLETED').length;
    const planToWatch = watchlist.filter(w => w.status === 'PLAN_TO_WATCH').length;
    const onHold = watchlist.filter(w => w.status === 'ON_HOLD').length;
    const dropped = watchlist.filter(w => w.status === 'DROPPED').length;
    const episodesWatched = watchlist.reduce((acc, w) => acc + (w.progress || 0), 0);
    
    // XP and Level Calculation
    // Base: 100 XP per episode, 500 XP per completed series
    const totalXP = (episodesWatched * 100) + (completed * 500);
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
    const progressToNextLevel = ((totalXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100;

    // Rank Title
    let rank = 'Trainee';
    let rankColor = 'text-white/40';
    if (level >= 10) {
      rank = 'Genin';
      rankColor = 'text-emerald-400';
    }
    if (level >= 25) {
      rank = 'Hunter';
      rankColor = 'text-blue-400';
    }
    if (level >= 50) {
      rank = 'S-Class Wizard';
      rankColor = 'text-purple-400';
    }
    if (level >= 100) {
      rank = 'Pirate King';
      rankColor = 'text-primary';
    }

    // Time Spent (Average 24 mins per episode)
    const totalMinutes = episodesWatched * 24;
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    // Genre Distribution (Mental model: most watched genres)
    // For now, mock data as genres aren't easily aggregated from WatchlistItem without more metadata
    const genres = [
      { label: 'Action', value: 85 },
      { label: 'Sci-Fi', value: 65 },
      { label: 'Fantasy', value: 45 },
      { label: 'Drama', value: 30 },
      { label: 'Romance', value: 20 },
    ];

    return {
      level,
      totalXP,
      progressToNextLevel,
      rank,
      rankColor,
      timeSpent: { days, hours, minutes },
      counts: { total, watching, completed, planToWatch, onHold, dropped, episodesWatched },
      genres
    };
  }, [watchlist]);

  return stats;
}
