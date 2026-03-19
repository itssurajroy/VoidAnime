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
  producerName?: string;
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

/* =========================
   KENJITSU API TYPES
   (Kaido, HiAnime, AnimePahe, Anizone)
========================= */

export type AnimeProvider = 'kaido' | 'hianime' | 'animepahe' | 'anizone';

export interface KaidoHomeData {
  data: SpotlightAnime[];
  trending: RankedAnime[];
  topAiring: AnimeCard[];
  mostPopular: AnimeCard[];
  favourites: AnimeCard[];
  recentlyCompleted: AnimeCard[];
  recentlyUpdated: AnimeCard[];
  recentlyAdded: AnimeCard[];
  topAnime: {
    daily: AnimeCard[];
    weekly: AnimeCard[];
    monthly: AnimeCard[];
  };
  topUpcoming: AnimeCard[];
}

export interface KaidoAnimeDetails {
  data: {
    id: string;
    name: string;
    japanese: string;
    romaji: string;
    quality: string;
    rating: string;
    producers: string;
    altnames: string;
    releaseDate: string;
    status: string;
    score: string;
    anilistId: number;
    malId: number;
    posterImage: string;
    genres: string[];
    studios: string[];
    synopsis: string;
    episodes: { dub: number; sub: number };
    totalEpisodes: number;
    type: string;
    duration: string;
  };
  providerEpisodes: KaidoEpisode[];
  characters: KaidoCharacter[];
  recommendedAnime: AnimeCard[];
  relatedAnime: AnimeCard[];
  mostPopular: AnimeCard[];
  relatedSeasons: KaidoRelatedSeason[];
  promotionVideos: KaidoPromotionVideo[];
}

export interface KaidoEpisode {
  episodeId: string;
  title: string;
  romaji: string;
  episodeNumber: number;
}

export interface KaidoCharacter {
  id: string;
  name: string;
  posterImage: string;
  role: string;
  voiceActor: {
    id: string;
    name: string;
    posterImage: string;
    language: string;
  };
}

export interface KaidoRelatedSeason {
  id: string;
  name: string;
  season: string;
  seasonPoster: string;
}

export interface KaidoPromotionVideo {
  url: string;
  title: string;
  thumbnail: string;
}

export interface KaidoSource {
  headers: {
    Referer: string;
  };
  data: {
    intro: { start: number; end: number };
    outro: { start: number; end: number };
    subtitles: KaidoSubtitle[];
    sources: KaidoStreamSource[];
  };
  syncData: {
    anilistId: number;
    malId: number;
    name: string;
  };
}

export interface KaidoSubtitle {
  file: string;
  label: string;
  kind: string;
  default: boolean;
}

export interface KaidoStreamSource {
  url: string;
  isM3u8: boolean;
  type: string;
}

export interface KaidoSearchResult {
  hasNextPage: boolean;
  currentPage: number;
  lastPage: number;
  data: AnimeCard[];
}

export interface KaidoGenreResult {
  hasNextPage: boolean;
  currentPage: number;
  lastPage: number;
  data: AnimeCard[];
}

export interface KaidoEpisodeServers {
  data: {
    sub: { serverId: number; serverName: string; mediaId: string }[];
    dub: { serverId: number; serverName: string; mediaId: string }[];
    raw: { serverId: number; serverName: string; mediaId: string }[];
    episodeNumber: number;
  };
}

/* =========================
   ANILIST VIA KENJITSU
========================= */

export interface AnilistSearchResult {
  hasNextPage: boolean;
  currentPage: number;
  total: number;
  lastPage: number;
  perPage: number;
  data: AnilistMedia[];
}

export interface AnilistMedia {
  malId: number;
  anilistId: number;
  image: string;
  color: string;
  bannerImage: string;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  trailer: {
    id: string | null;
    site: string | null;
    thumbnail: string | null;
  };
  format: string;
  status: string;
  duration: number | null;
  score: number;
  genres: string[];
  episodes: number | null;
  synopsis: string;
  season: string | null;
  releaseDate: string | null;
  endDate: string | null;
  studio: string | null;
  producers: string[];
}

export interface AnilistCharacter {
  malId: number;
  anilistId: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  characters: {
    role: string;
    id: number;
    name: string;
    image: string;
    voiceActors: {
      name: string;
      language: string;
      image: string;
    }[];
  }[];
}

export interface AnilistRelated {
  data: {
    anilistId: number;
    malId: number;
    title: {
      romaji: string;
      english: string | null;
      native: string;
    };
    type: string;
    score: number;
    image: string;
    bannerImage: string;
    color: string;
  }[];
}

export interface AnilistAiringSchedule {
  hasNextPage: boolean;
  currentPage: number;
  total: number;
  lastPage: number;
  perPage: number;
  data: {
    malId: number;
    anilistId: number;
    bannerImage: string;
    image: string;
    color: string;
    title: {
      romaji: string;
      english: string | null;
      native: string | null;
    };
    format: string;
    status: string;
    popularity: number;
    score: number;
    genres: string[];
    episodes: number;
    duration: number;
    synopsis: string;
    season: string;
    releaseDate: string;
    endDate: string;
    nextAiringEpisode: {
      episode: number;
      id: number;
      airingAt: number;
      timeUntilAiring: number;
    };
  }[];
}
