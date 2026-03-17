export type MediaType = 'ANIME' | 'MANGA';
export type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
export type MediaSeason = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER';
export type MediaFormat = 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA' | 'MUSIC' | 'MANGA' | 'NOVEL' | 'ONE_SHOT';
export type MediaSort = 'TRENDING_DESC' | 'POPULARITY_DESC' | 'SCORE_DESC' | 'START_DATE_DESC' | 'UPDATED_AT_DESC' | 'SEARCH_MATCH';

export interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color?: string;
}

export interface Title {
  romaji: string;
  english?: string;
  native?: string;
  userPreferred?: string;
}

export interface FuzzyDate {
  year?: number;
  month?: number;
  day?: number;
}

export interface Studio {
  id: number;
  name: string;
  isAnimationStudio: boolean;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  category?: string;
  rank?: number;
  isGeneralSpoiler?: boolean;
  isMediaSpoiler?: boolean;
  isAdult?: boolean;
}

export interface AiringEpisode {
  id: number;
  airingAt: number;
  episode: number;
  timeUntilAiring: number;
  mediaId: number;
}

export interface ExternalLink {
  id: number;
  url: string;
  site: string;
  type?: string;
  icon?: string;
  color?: string;
}

export interface StreamingEpisode {
  title?: string;
  thumbnail?: string;
  url?: string;
  site?: string;
}

export interface Character {
  id: number;
  name: {
    full: string;
    native?: string;
  };
  image: {
    large?: string;
    medium?: string;
  };
  role?: 'MAIN' | 'SUPPORTING' | 'BACKGROUND';
  voiceActors?: VoiceActor[];
}

export interface VoiceActor {
  id: number;
  name: {
    full: string;
    native?: string;
  };
  image?: {
    large?: string;
    medium?: string;
  };
  language?: string;
}

export interface Staff {
  id: number;
  name: {
    full: string;
    native?: string;
  };
  image?: {
    large?: string;
    medium?: string;
  };
  role?: string;
  primaryOccupations?: string[];
}

export interface MediaRelation {
  id: number;
  type: MediaType;
  format?: MediaFormat;
  title: Title;
  coverImage: CoverImage;
  relationType: string;
  status?: MediaStatus;
}

export interface Recommendation {
  id: number;
  mediaRecommendation: Anime;
  rating?: number;
}

export interface Episode {
  id: number;
  number: number;
  title?: string;
  titleRomaji?: string;
  thumbnail?: string;
  duration?: number;
  airDate?: string;
  isFiller?: boolean;
  isRecap?: boolean;
  watched?: boolean;
}

export interface Trailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}

export interface Anime {
  id: number;
  idMal?: number;
  type: MediaType;
  format?: MediaFormat;
  status?: MediaStatus;
  season?: MediaSeason;
  seasonYear?: number;
  title: Title;
  description?: string;
  coverImage: CoverImage;
  bannerImage?: string;
  trailer?: Trailer;
  episodes?: number;
  duration?: number;
  chapters?: number;
  volumes?: number;
  genres: string[];
  tags?: Tag[];
  averageScore?: number;
  meanScore?: number;
  popularity?: number;
  favourites?: number;
  trending?: number;
  studios?: Studio[];
  startDate?: FuzzyDate;
  endDate?: FuzzyDate;
  nextAiringEpisode?: AiringEpisode;
  airingSchedule?: { nodes: AiringEpisode[] };
  relations?: { nodes: MediaRelation[] };
  recommendations?: { nodes: Recommendation[] };
  characters?: { nodes: Character[] };
  staff?: { nodes: Staff[] };
  externalLinks?: ExternalLink[];
  streamingEpisodes?: StreamingEpisode[];
  source?: string;
  countryOfOrigin?: string;
  isAdult?: boolean;
  hashtag?: string;
  synonyms?: string[];
  rankings?: { rank: number; type: string; season?: string; year?: number; allTime?: boolean }[];
}

export interface AnimeDetail extends Anime {
  // Supplemental from Jikan
  malScore?: number;
  malRank?: number;
  malPopularity?: number;
  malReviews?: MalReview[];
  episodeList?: Episode[];

  // Supplemental from Kitsu
  kitsuId?: string;
  streamingLinks?: { site: string; url: string }[];
  episodeThumbnails?: Record<number, string>;
}

export interface MalReview {
  malId: number;
  reviewer: string;
  reviewedAt: string;
  score: number;
  content: string;
  spoiler: boolean;
}

export interface SearchFilters {
  query?: string;
  type?: MediaType;
  status?: MediaStatus;
  season?: MediaSeason;
  seasonYear?: number;
  genres?: string[];
  format?: MediaFormat;
  sort?: MediaSort;
  page?: number;
  perPage?: number;
  isAdult?: boolean;
}

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}
