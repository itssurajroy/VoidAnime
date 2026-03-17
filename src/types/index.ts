/* =========================
   API RESPONSE
 ========================= */
export interface ApiResponse<T> {
  status: number;
  data: T;
}

/* =========================
   HOME & DISCOVERY
========================= */

export interface HomeData {
  genres: string[];
  latestEpisodeAnimes: AnimeCard[];
  spotlightAnimes: SpotlightAnime[];
  top10Animes: {
    today: RankedAnime[];
    week: RankedAnime[];
    month: RankedAnime[];
  };
  topAiringAnimes: BasicAnime[];
  topUpcomingAnimes: AnimeCard[];
  trendingAnimes: RankedAnime[];
  mostPopularAnimes: AnimeCard[];
  mostFavoriteAnimes: AnimeCard[];
  latestCompletedAnimes: AnimeCard[];
}

/* =========================
   SHARED ANIME TYPES
========================= */

export interface AnimeCard {
  id: string;
  name: string;
  jname?: string;
  poster: string;
  type?: string;
  rating?: string;
  duration?: string;
  episodes?: {
    sub: number;
    dub: number;
  };
  otherInfo?: string[];
}

export interface RankedAnime extends AnimeCard {
  rank: number;
  jname?: string;
}

export interface BasicAnime {
  id: string;
  name: string;
  poster: string;
  jname?: string;
}

export interface SpotlightAnime extends AnimeCard {
  description: string;
  rank: number;
  otherInfo: string[];
  jname: string;
}

/* =========================
   A–Z LIST
========================= */

export interface AZListData {
  sortOption: string;
  animes: AnimeCard[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
}

/* =========================
   TOOLTIP / QTIP
========================= */

export interface QtipData {
  anime: {
    id: string;
    name: string;
    malscore: string;
    quality: string;
    episodes: {
      sub: number;
      dub: number;
    };
    type: string;
    description: string;
    jname: string;
    synonyms: string;
    aired: string;
    status: string;
    genres: string[];
  };
}

/* =========================
   ANIME DETAILS
========================= */

export interface Character {
  id: number;
  poster: string;
  name: string;
  cast: string;
}

export interface VoiceActor {
  name: string;
  poster: string;
}

export interface CharacterVoiceActor {
  character: Character;
  voiceActor?: VoiceActor;
}

export interface PromotionalVideo {
  title: string;
  source: string;
  thumbnail: string;
}

export interface AnimeInfo {
  id: string;
  name: string;
  poster: string;
  description: string;
  genres?: string[];
  stats?: {
    rating?: string;
    quality?: string;
    episodes?: {
      sub?: number;
      dub?: number;
    };
    type?: string;
    duration?: string;
  };
  promotionalVideos?: PromotionalVideo[];
  characterVoiceActor?: CharacterVoiceActor[];
}

export interface AnimeMoreInfo {
  japanese?: string;
  synonyms?: string;
  aired?: string;
  premiered?: string;
  duration?: string;
  status?: string;
  malscore?: number;
  studios?: string;
  producers?: string[];
  genres?: string[];
  [key: string]: string | string[] | number | undefined;
}

export interface RelatedAnime {
  id: string;
  name: string;
  jname?: string;
  poster: string;
  relation: string;
}

export interface AnimeDetails {
  info: AnimeInfo;
  moreInfo: AnimeMoreInfo;
}

export interface AnimeDetailsData {
  anime: AnimeDetails;
  mostPopularAnimes: AnimeCard[];
  recommendedAnimes: AnimeCard[];
  relatedAnimes: RelatedAnime[];
  seasons: any[];
}

/* =========================
   EPISODES & STREAMING
========================= */

export interface Episode {
  number: number;
  title: string;
  episodeId: string;
  isFiller: boolean;
}

export interface EpisodeListData {
  totalEpisodes: number;
  episodes: Episode[];
}

export interface EpisodeServersData {
  episodeId: string;
  episodeNo: number;
  sub: Server[];
  dub: Server[];
  raw: Server[];
}

export interface Server {
  serverId: number;
  serverName: string;
}

export interface EpisodeSourcesData {
  headers?: {
    Referer?: string;
    [key: string]: string | undefined;
  };
  sources: {
    url: string;
    isM3U8: boolean;
    quality?: string;
  }[];
  tracks?: {
    lang: string;
    url: string;
    default?: boolean;
  }[];
  subtitles?: {
    lang: string;
    url: string;
    default?: boolean;
  }[];
  intro?: {
    start: number;
    end: number;
  };
  outro?: {
    start: number;
    end: number;
  };
  anilistID?: number | null;
  malID?: number | null;
}


/* =========================
   SEARCH
========================= */

export interface SearchResultsData {
  animes: AnimeCard[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  totalAnimes?: number;
  searchQuery?: string;
  searchFilters?: Record<string, string>;
}

export interface SearchSuggestionData {
  suggestions: {
    id: string;
    name: string;
    poster: string;
    jname: string;
    moreInfo: string[];
  }[];
}

/* =========================
   GENRES & CATEGORIES
========================= */

export interface GenreCategoryData {
  animes: AnimeCard[];
  genres?: string[];
  genreName?: string;
  categoryName?: string;
  topAiringAnimes?: AnimeCard[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface ProducerData {
  producerName: string;
  animes: AnimeCard[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

/* =========================
   SCHEDULE
========================= */

export interface ScheduleData {
  scheduledAnimes: {
    id: string;
    name: string;
    jname: string;
    time: string;
    airingTimestamp: number;
    secondsUntilAiring: number;
  }[];
}

export interface NextEpisodeSchedule {
  airingISOTimestamp: string | null;
  airingTimestamp: number | null;
  secondsUntilAiring: number | null;
}


/* =========================
   ANILIST
 ========================= */
export interface AniListTrailer {
  id: string;
  site: string;
  thumbnail: string;
}

export interface AniListCharacter {
  id: number;
  name: { full: string; };
  image: { large: string; };
}

export interface AniListVoiceActor {
  id: number;
  name: { full: string; };
  image: { large: string; };
}

export interface AniListCharacterEdge {
  role: string;
  node: AniListCharacter;
  voiceActors: AniListVoiceActor[];
}

export interface AniListStudio {
  id: number;
  name: string;
}

export interface AniListExternalLink {
  id: number;
  url: string;
  site: string;
  icon: string | null;
  color: string | null;
}

export interface AniListTag {
  id: number;
  name: string;
  description: string;
  rank: number;
  category: string;
}

export interface AniListRecommendation {
  node: {
    mediaRecommendation: {
      id: string;
      idMal: number;
      title: {
        romaji: string;
        english: string;
        native: string;
      };
      coverImage: {
        large: string;
      };
      format: string;
      type: string;
      status: string;
      averageScore: number;
    }
  }
}

export interface AniListRelation {
  relationType: string;
  node: {
    id: string;
    idMal: number;
    type: string;
    format: string;
    status: string;
    title: {
      romaji: string;
      english: string;
      native: string;
    };
    coverImage: {
      large: string;
    };
  }
}

export interface AniListMedia {
  id: number;
  idMal?: number;
  title?: {
    romaji: string;
    english: string;
    native: string;
  };
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
  format: string;
  averageScore: number | null;
  meanScore: number | null;
  popularity: number | null;
  favourites: number | null;
  season: string | null;
  seasonYear: number | null;
  episodes: number | null;
  description: string | null;
  bannerImage: string | null;
  genres?: string[];
  tags?: AniListTag[];
  nextAiringEpisode: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  } | null;
  trailer: AniListTrailer | null;
  characters: {
    edges: AniListCharacterEdge[];
  };
  recommendations?: {
    edges: AniListRecommendation[];
  };
  relations?: {
    edges: AniListRelation[];
  };
  studios: {
    nodes: AniListStudio[];
  };
  externalLinks: AniListExternalLink[];
}
/* =========================
   NEWS
========================= */

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string; // Rich text / Markdown content
  slug?: string;
  status?: 'published' | 'draft' | 'archived';
  tags?: string[];
  authorName?: string;
  authorAvatar?: string;
  authorRole?: string;
  seoTitle?: string;
  seoDescription?: string;
  type: 'rss' | 'megaphone' | 'message' | 'default' | 'article';
  thumbnailText?: string[];
  gradient?: string;
  image?: string; // Cover image
  date: string;
  createdAt: any;
  updatedAt?: any;
}

/* =========================
   DASHBOARD & USER
========================= */

export interface WatchHistoryItem {
  animeId: string;
  episodeId: string;
  animeName: string;
  animePoster: string;
  episodeNumber: number;
  progress: number; // in seconds
  duration: number; // in seconds
  watchedAt: any; // Firestore timestamp
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | React.ComponentType<{ className?: string }>;
  earned: boolean;
}

export type WatchlistStatus = 'WATCHING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED' | 'PLAN_TO_WATCH';

export interface WatchlistItem extends AnimeCard {
  status: WatchlistStatus;
  progress: number; // episodes watched
  totalEpisodes: number;
}
