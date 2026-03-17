import type { UserRole } from './db';

// This file will contain types specific to the admin panel.

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: UserRole;
}

export interface Anime {
  id: string;

  // Core identity
  title: string;
  japaneseTitle?: string;
  slug: string;

  // Content
  synopsis: string;
  poster: string;
  banner?: string;
  trailerUrl?: string;

  // Metadata
  type: "TV" | "Movie" | "OVA" | "ONA" | "Special";
  status: "airing" | "completed" | "upcoming";
  season?: string;
  year?: number;
  duration?: string;

  // Classification
  genres: string[];
  studios?: string[];
  producers?: string[];

  // Stats
  totalEpisodes?: number;
  rating?: string;
  score?: number;

  // SEO
  seo: {
    title?: string;
    description?: string;
    canonical?: string;
    noindex?: boolean;
  };

  // Visibility & control
  isPublished: boolean;
  isFeatured: boolean;

  // Audit
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string; // Should be user ID
}


export interface SeoHealth {
    id: string;
    title: string;
    type: 'Anime' | 'Episode';
    seoScore: number; // 0-100
    status: 'Good' | 'Needs Improvement' | 'Poor';
    issues: string[];
    lastChecked: string;
}
