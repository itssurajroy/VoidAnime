import { Anime, AnimeDetail, PageInfo, SearchFilters } from './anime';

export interface ApiResponse<T> {
  data: T;
  error?: string;
  cached?: boolean;
  ttl?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface AniListResponse<T> {
  data: T;
  errors?: { message: string; status: number }[];
}

export interface SearchResult {
  media: Anime[];
  pageInfo: PageInfo;
}

export interface TrendingResult {
  media: Anime[];
  pageInfo: PageInfo;
}

export interface SeasonalResult {
  media: Anime[];
  pageInfo: PageInfo;
  season?: string;
  year?: number;
}

export interface AiringScheduleResult {
  airingSchedules: {
    id: number;
    airingAt: number;
    episode: number;
    timeUntilAiring: number;
    media: Pick<Anime, 'id' | 'title' | 'coverImage' | 'episodes' | 'format' | 'genres'>;
  }[];
}

export interface GatewaySearchParams extends SearchFilters {}

export interface JikanAnimeResponse {
  data: {
    mal_id: number;
    score: number | null;
    rank: number | null;
    popularity: number | null;
    synopsis: string | null;
    title_english: string | null;
  };
}

export interface JikanEpisodesResponse {
  data: {
    mal_id: number;
    title: string | null;
    title_romaji: string | null;
    aired: string | null;
    score: number | null;
    filler: boolean;
    recap: boolean;
  }[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export interface JikanReviewsResponse {
  data: {
    mal_id: number;
    url: string;
    reviewer: {
      username: string;
      url: string;
      image_url: string;
    };
    review: string;
    score: number;
    is_spoiler: boolean;
    date: string;
  }[];
}

export interface KitsuSearchResponse {
  data: {
    id: string;
    attributes: {
      canonicalTitle: string;
      averageRating: string | null;
      streamingLinks?: { streamerId: string }[];
    };
  }[];
}

export interface KitsuAnimeResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      canonicalTitle: string;
      synopsis: string | null;
      averageRating: string | null;
      startDate: string | null;
      endDate: string | null;
      streamingLinks?: { streamerId: string; url?: string }[];
    };
  };
}
