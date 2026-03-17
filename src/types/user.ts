import { Timestamp } from 'firebase/firestore';

export type WatchStatus = 'WATCHING' | 'COMPLETED' | 'DROPPED' | 'PLANNING' | 'PAUSED';
export type ScoreFormat = 'POINT_10' | 'POINT_100' | 'POINT_5' | 'POINT_3' | 'POINT_10_DECIMAL';
export type ThemeMode = 'light' | 'dark' | 'amoled';
export type FillerMode = 'SHOW_ALL' | 'FLAG_ONLY' | 'SKIP_AUTO';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL?: string;
  bio?: string;
  anilistToken?: string;
  malToken?: string;
  isPro: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: UserSettings;
  stats: UserStats;
  gamification?: GamificationData;
  socialLinks?: SocialLinks;
}

export interface UserSettings {
  theme: ThemeMode;
  defaultScoreFormat: ScoreFormat;
  fillerMode: FillerMode;
  notificationsEnabled: boolean;
  listPrivacy: 'public' | 'private' | 'friends';
  preferredLanguage: 'english' | 'romaji' | 'native';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  episodeAiring: boolean;
  newSeason: boolean;
  achievementUnlocked: boolean;
  weeklyDigest: boolean;
}

export interface SocialLinks {
  twitter?: string;
  mal?: string;
  anilist?: string;
  letterboxd?: string;
}

export interface UserStats {
  totalAnimeWatched: number;
  totalEpisodesWatched: number;
  totalMangaRead: number;
  totalChaptersRead: number;
  averageScore: number;
  totalDaysWatched: number;
  completionRate: number;
  genreBreakdown: Record<string, number>;
  scoreDistribution: Record<string, number>;
}

export interface GamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastActiveDate: string;
  achievements: string[];
  badges: string[];
}

export interface IdMap {
  anilistId: number;
  malId?: number;
  kitsuId?: string;
  anidbId?: string;
  updatedAt: Timestamp;
}

export interface EpisodeData {
  watchedAt: Timestamp;
  stoppedAt?: number;
}

export interface ListEntry {
  anilistId: number;
  status: WatchStatus;
  progress: number;
  totalEpisodes?: number;
  score: number;
  notes: string;
  rewatches: number;
  idMap: Omit<IdMap, 'anilistId' | 'updatedAt'>;
  episodeData: Record<number, EpisodeData>;
  timestamps: {
    started?: Timestamp | null;
    updated: Timestamp;
    completed?: Timestamp | null;
  };
  title?: string;
  coverImage?: string;
  totalEp?: number;
  format?: string;
}

export interface CustomList {
  id: string;
  uid: string;
  name: string;
  color?: string;
  icon?: string;
  entries: number[];
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  uid: string;
  anilistId: number;
  mediaTitle: string;
  mediaCover?: string;
  body: string;
  score: number;
  tags: string[];
  containsSpoilers: boolean;
  likes: number;
  likedBy: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ActivityType = 'COMPLETED' | 'SCORED' | 'STARTED' | 'REVIEWED' | 'DROPPED' | 'PAUSED' | 'EPISODE_WATCHED' | 'ADDED';

export interface ActivityItem {
  id: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  type: ActivityType;
  mediaId: number;
  mediaTitle: string;
  mediaCover?: string;
  value?: string | number;
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  uid: string;
  anilistId: number;
  mediaTitle: string;
  nextEpisode: number;
  nextAirAt: number;
  fcmTokens: string[];
}

export interface FollowData {
  following: string[];
  followers: string[];
}

export interface PublicProfile extends Omit<UserProfile, 'email' | 'settings'> {
  followersCount: number;
  followingCount: number;
}
