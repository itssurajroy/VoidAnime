export interface GamificationProfile {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  longestStreak: number;
  badges: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  unlockedAt?: string;
}

export interface UserLevel {
  currentLevel: number;
  currentXp: number;
  xpToNext: number;
  progress: number;
}

export interface Streak {
  current: number;
  longest: number;
  lastActive: string;
}

export type XPEvent = 'WATCH_EPISODE' | 'COMPLETE_SERIES' | 'WRITE_REVIEW' | 'SCORE_TITLE' | 'DAILY_LOGIN';

export interface Badge {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}
