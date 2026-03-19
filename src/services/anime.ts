// Kenjitsu API - Full TypeScript Client
// Covers: Animepahe, Anizone, HiAnime, Kaido, Anilist (Meta)
// Base URL: https://drifter-sigma.vercel.app/api

const BASE_URL = process.env.NEXT_PUBLIC_ANIME_API_BASE_URL || 'https://api.voidanime.online';

const HLS_PROXY_PRIMARY = process.env.NEXT_PUBLIC_HLS_PROXY_PRIMARY || 'https://stream.voidanime.online/proxy?url=';
const HLS_PROXY_FALLBACK = process.env.NEXT_PUBLIC_HLS_PROXY_FALLBACK || 'https://proxy-xi-five.vercel.app/proxy?url=';

// ─────────────────────────────────────────────
// Enums / Union Types
// ─────────────────────────────────────────────

export type SubDubRaw = "sub" | "dub" | "raw";

export type AnimeFormat = "TV" | "MOVIE" | "SPECIALS" | "OVA" | "ONA";

export type AnilistFormat = "TV" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";

export type AnilistTopCategory = "airing" | "trending" | "upcoming" | "rating" | "popular";

export type AnilistSeason = "SPRING" | "SUMMER" | "FALL" | "WINTER";

export type HiAnimeCategory = "subbed" | "dubbed" | "favourites" | "popular" | "airing";

export type HiAnimeRecentStatus = "completed" | "added" | "updated";

export type HiAnimeServer = "hd-1" | "hd-2";

export type KaidoServer = "vidstreaming" | "vidcloud";

export type AnilistProvider = "allanime" | "hianime" | "animepahe" | "anizone" | "animekai";

export type AnimeProvider = 'kaido' | 'hianime' | 'animepahe' | 'anizone';

// ─────────────────────────────────────────────
// Generic Response Wrapper
// ─────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  [key: string]: unknown;
}

async function kenjitsuFetch<T>(endpoint: string, revalidate: number = 3600): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      next: { revalidate }
    });

    if (!res.ok) {
      console.error(`API fetch failed: ${res.status} on ${url}`);
      return { data: null as unknown as T };
    }

    const data = await res.json();
    return { data: data as T };
  } catch (error) {
    console.error(`Fetch error on ${url}:`, error);
    return { data: null as unknown as T };
  }
}

// Direct fetch for streaming sources (no caching)
async function directFetch<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Direct fetch failed: ${res.status} on ${url}`);
      return null as unknown as T;
    }
    return await res.json() as T;
  } catch (error) {
    console.error(`Direct fetch error on ${url}:`, error);
    return null as unknown as T;
  }
}

// ─────────────────────────────────────────────
// ANIZONE SOURCES TYPES
// ─────────────────────────────────────────────

export interface AnizoneSource {
  url: string;
  isM3U8: boolean;
  type: string;
}

export interface AnizoneSubtitle {
  url: string;
  lang: string;
  default: boolean;
}

export interface AnizoneTrack {
  url: string;
  type: string;
}

export interface AnizoneSourceResponse {
  headers: {
    Referer: string;
  };
  data: {
    subtitles: AnizoneSubtitle[];
    sources: AnizoneSource[];
    tracks: AnizoneTrack[];
    posterImage: string;
  };
}

// ═════════════════════════════════════════════════════════════════════
// ANIME DETAIL TYPES (Unified for HiAnime, Kaido, AnimePahe, Anizone)
// ═════════════════════════════════════════════════════════════════════

export interface DetailedAnime {
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
  episodes: {
    dub: number;
    sub: number;
  };
  totalEpisodes: number;
  type: string;
  duration: string;
}

export interface DetailedEpisode {
  episodeId: string;
  title: string;
  romaji: string;
  episodeNumber: number;
}

export interface CharacterInfo {
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

export interface RelatedAnimeInfo {
  id: string;
  name: string;
  romaji: string;
  type: string;
  duration?: string;
  posterImage: string;
  episodes: {
    sub: number;
    dub: number;
  };
  totalEpisodes: number;
}

export interface RelatedSeason {
  id: string;
  name: string;
  season: string;
  seasonPoster: string;
}

export interface PromotionVideo {
  url: string;
  title: string;
  thumbnail: string;
}

export interface AnimeDetailResponse {
  data: DetailedAnime;
  providerEpisodes: DetailedEpisode[];
  characters: CharacterInfo[];
  recommendedAnime: RelatedAnimeInfo[];
  relatedAnime: RelatedAnimeInfo[];
  mostPopular: RelatedAnimeInfo[];
  relatedSeasons: RelatedSeason[];
  promotionVideos: PromotionVideo[];
}

// ═════════════════════════════════════════════════════════════════════
// ANILIST META API TYPES
// ═════════════════════════════════════════════════════════════════════

export interface AnilistTitle {
  romaji: string;
  english: string | null;
  native: string;
}

export interface AnilistTitleNullable {
  romaji: string;
  english: string | null;
  native: string | null;
}

export interface AnilistTrailer {
  id: string | null;
  site: string | null;
  thumbnail: string | null;
}

export interface NextAiringEpisode {
  episode: number;
  id: number;
  airingAt: number;
  timeUntilAiring: number;
}

export interface AnilistAnime {
  malId: number;
  anilistId: number;
  image: string;
  color: string;
  bannerImage: string;
  title: AnilistTitle;
  trailer: AnilistTrailer;
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

export interface PaginatedResponse<T> {
  hasNextPage: boolean;
  currentPage: number;
  total: number;
  lastPage: number;
  perPage: number;
  data: T[];
}

export interface SingleResponse<T> {
  data: T;
}

export interface AnilistRelatedAnime {
  anilistId: number;
  malId: number;
  title: AnilistTitle;
  type: string;
  score: number;
  image: string;
  bannerImage: string;
  color: string;
}

export interface AiringDateEntry {
  malId: number;
  anilistId: number;
  bannerImage: string;
  image: string;
  color: string;
  title: AnilistTitleNullable;
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
  nextAiringEpisode: NextAiringEpisode;
}

export interface AiringMediaSchedule {
  malId: number;
  anilistId: number;
  image: string;
  color: string;
  bannerImage: string;
  title: AnilistTitleNullable;
  status: string;
  format: string;
  duration: number;
  releaseDate: string;
  endDate: string;
  nextAiringEpisode: NextAiringEpisode;
}

export interface ProviderInfo {
  id: string;
  name: string;
  romaji: string;
  provider: string;
  score: number | null;
}

export interface AnilistMappingResult extends AnilistAnime {
  provider: ProviderInfo;
}

export interface ProviderEpisode {
  episodeId: string;
  episodeNumber: number;
  title: string;
  rating: number | null;
  aired: string;
  overview: string;
  thumbnail: string;
  provider: string;
}

export interface AnilistProviderEpisodesResponse {
  data: AnilistAnime;
  providerEpisodes: ProviderEpisode[];
}

// ─────────────────────────────────────────────
// Common Schemas
// ─────────────────────────────────────────────

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

export interface SpotlightAnime extends AnimeCard {
  description: string;
  rank: number;
  otherInfo: string[];
  jname: string;
}

export interface RankedAnime extends AnimeCard {
  rank: number;
  jname?: string;
}

export interface Episode {
  episodeId: string;
  episodeNumber: number;
  title?: string;
  isFiller?: boolean;
}

export interface Server {
  serverId: number;
  serverName: string;
}

export interface EpisodeServers {
  sub: Server[];
  dub: Server[];
  raw: Server[];
}

export interface VideoSource {
  url: string;
  quality?: string;
  isM3U8?: boolean;
}

export interface StreamingSources {
  sources: VideoSource[];
  headers?: Record<string, string>;
  subtitles?: { lang: string; url: string; default?: boolean }[];
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
}

// ─────────────────────────────────────────────
// SOURCE TRANSFORMATION TYPES
// ─────────────────────────────────────────────

export interface StreamSource {
  sources: { url: string; isM3U8: boolean; quality: string }[];
  subtitles: { url: string; lang: string; default: boolean }[];
  tracks: { url: string; lang: string }[];
  headers: { Referer: string };
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
  posterImage?: string;
  provider: AnimeProvider;
}

// ─────────────────────────────────────────────
// SOURCE TRANSFORMATION FUNCTIONS
// ─────────────────────────────────────────────

function transformKaidoSources(res: any): StreamSource | null {
  try {
    const data = res?.data?.data || res?.data;
    if (!data) return null;

    const sources = data.sources || [];
    if (!sources.length) return null;

    return {
      sources: sources.map((s: any) => ({
        url: s.url,
        isM3U8: s.isM3u8 || s.url?.includes('.m3u8'),
        quality: s.type || s.quality || 'auto'
      })),
      subtitles: (data.subtitles || []).map((s: any) => ({
        url: s.file,
        lang: s.label || s.lang || 'en',
        default: s.default || false
      })),
      tracks: [],
      headers: { Referer: data.Referer || res.data?.headers?.Referer || '' },
      intro: data.intro,
      outro: data.outro,
      provider: 'kaido'
    };
  } catch (e) {
    console.error('[Kaido] Transform error:', e);
    return null;
  }
}

function transformHiAnimeSources(res: any): StreamSource | null {
  try {
    const data = res?.data?.data || res?.data;
    if (!data) return null;

    const sources = data.sources || [];
    if (!sources.length) return null;

    return {
      sources: sources.map((s: any) => ({
        url: s.url,
        isM3U8: s.isM3u8 || s.url?.includes('.m3u8'),
        quality: s.type || s.quality || 'auto'
      })),
      subtitles: (data.subtitles || []).map((s: any) => ({
        url: s.file,
        lang: s.label || s.lang || 'en',
        default: s.default || false
      })),
      tracks: [],
      headers: { Referer: data.Referer || res.data?.headers?.Referer || '' },
      intro: data.intro,
      outro: data.outro,
      provider: 'hianime'
    };
  } catch (e) {
    console.error('[HiAnime] Transform error:', e);
    return null;
  }
}

function transformAnimePaheSources(res: any): StreamSource | null {
  try {
    const data = res?.data?.data || res?.data;
    if (!data) return null;

    const sources = data.sources || [];
    if (!sources.length) return null;

    return {
      sources: sources.map((s: any) => ({
        url: s.url,
        isM3U8: s.isM3u8 || s.type === 'hls' || s.url?.includes('.m3u8'),
        quality: s.quality || s.type || 'auto'
      })),
      subtitles: (data.subtitles || []).map((s: any) => ({
        url: s.file,
        lang: s.label || s.lang || 'en',
        default: s.default || false
      })),
      tracks: [],
      headers: { Referer: data.Referer || res.data?.headers?.Referer || '' },
      intro: data.intro,
      outro: data.outro,
      provider: 'animepahe'
    };
  } catch (e) {
    console.error('[AnimePahe] Transform error:', e);
    return null;
  }
}

// ─────────────────────────────────────────────
// UNIFIED STREAM SOURCES WITH FALLBACK
// ─────────────────────────────────────────────

export async function getStreamSources(
  episodeId: string,
  preferredProvider: AnimeProvider = 'kaido',
  version: SubDubRaw = 'sub'
): Promise<StreamSource | null> {
  const providers: AnimeProvider[] = ['kaido', 'hianime', 'animepahe'];
  
  // Start from preferred provider
  const startIndex = providers.indexOf(preferredProvider);
  const orderedProviders = [
    ...providers.slice(startIndex),
    ...providers.slice(0, startIndex)
  ];

  for (const provider of orderedProviders) {
    try {
      console.log(`[StreamSources] Trying ${provider}...`);
      let res: any = null;

      switch (provider) {
        case 'kaido':
          res = await kaido.sources(episodeId, version, 'vidcloud');
          if (res?.data) {
            const transformed = transformKaidoSources(res);
            if (transformed) {
              console.log(`[StreamSources] ✓ ${provider} worked!`);
              return transformed;
            }
          }
          break;

        case 'hianime':
          res = await hianime.sources(episodeId, version, 'hd-1');
          if (res?.data) {
            const transformed = transformHiAnimeSources(res);
            if (transformed) {
              console.log(`[StreamSources] ✓ ${provider} worked!`);
              return transformed;
            }
          }
          break;

        case 'animepahe':
          res = await animepahe.sources(episodeId, version);
          if (res?.data) {
            const transformed = transformAnimePaheSources(res);
            if (transformed) {
              console.log(`[StreamSources] ✓ ${provider} worked!`);
              return transformed;
            }
          }
          break;
      }
    } catch (e) {
      console.error(`[StreamSources] ${provider} failed:`, e);
    }
  }

  console.error('[StreamSources] All providers failed');
  return null;
}

// ─────────────────────────────────────────────
// EPISODE SERVERS WITH FALLBACK
// ─────────────────────────────────────────────

export async function getEpisodeServersWithFallback(episodeId: string): Promise<any> {
  // Try Kaido first
  let res = await kaido.servers(episodeId);
  if (res?.data) return res;

  // Fallback to HiAnime
  res = await hianime.servers(episodeId);
  if (res?.data) return res;

  // Fallback to AnimePahe
  res = await animepahe.servers(episodeId);
  return res;
}

// ─────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────

export function getProxiedUrl(streamUrl: string, referer?: string): string {
  const encodedUrl = encodeURIComponent(streamUrl);
  if (referer) {
    const headers = JSON.stringify({ Referer: referer });
    const encodedHeaders = encodeURIComponent(headers);
    return `${HLS_PROXY_PRIMARY}${encodedUrl}&headers=${encodedHeaders}`;
  }
  return `${HLS_PROXY_PRIMARY}${encodedUrl}`;
}

export function getProxiedUrlWithFallback(streamUrl: string, referer?: string): { primary: string; fallback: string } {
  const encodedUrl = encodeURIComponent(streamUrl);
  let primary: string;
  let fallback: string;
  
  if (referer) {
    const headers = JSON.stringify({ Referer: referer });
    const encodedHeaders = encodeURIComponent(headers);
    primary = `${HLS_PROXY_PRIMARY}${encodedUrl}&headers=${encodedHeaders}`;
    fallback = `${HLS_PROXY_FALLBACK}${encodedUrl}&headers=${encodedHeaders}`;
  } else {
    primary = `${HLS_PROXY_PRIMARY}${encodedUrl}`;
    fallback = `${HLS_PROXY_FALLBACK}${encodedUrl}`;
  }
  
  return { primary, fallback };
}

// ─────────────────────────────────────────────
// UNIFIED ANIME MAPPING
// ─────────────────────────────────────────────

export interface AnimeMappingResult {
  provider: AnimeProvider;
  animeId: string;
  episodeId?: string;
  name?: string;
  poster?: string;
}

export interface ProviderMappingData {
  id: string;
  name: string;
  romaji?: string;
  posterImage?: string;
  anilistId?: number;
  malId?: number;
}

/**
 * Extract anime name from slug by removing trailing numbers/ids
 * Example: "bleach-thousand-year-blood-war-19322" → "bleach-thousand-year-blood-war"
 */
export function extractAnimeName(slug: string): string {
  // Remove trailing numbers (like anime IDs)
  const cleaned = slug.replace(/-\d+$/, '');
  return cleaned;
}

/**
 * Try to get the numeric ID from a slug
 * Example: "bleach-19322" → "19322" or null
 */
export function extractNumericId(slug: string): string | null {
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : null;
}

/**
 * Search AniList for anime and get provider mappings
 * Returns the correct provider ID for the given provider
 */
export async function mapAnimeToProvider(
  animeSlug: string,
  targetProvider: AnimeProvider = 'kaido'
): Promise<AnimeMappingResult | null> {
  try {
    const animeName = extractAnimeName(animeSlug);
    console.log(`[Mapping] Searching AniList for: ${animeName}`);

    // Search AniList by name
    const searchRes = await anilist.search(animeName, 1, 5);
    const results = searchRes?.data?.data || [];
    
    if (!results.length) {
      console.log(`[Mapping] No AniList results for: ${animeName}`);
      return null;
    }

    // Find best match (first result or exact match)
    const bestMatch = results.find((r: any) => 
      r.title?.romaji?.toLowerCase().includes(animeName.toLowerCase()) ||
      r.title?.english?.toLowerCase().includes(animeName.toLowerCase())
    ) || results[0];

    const anilistId = bestMatch?.anilistId || bestMatch?.id;
    
    if (!anilistId) {
      console.log(`[Mapping] No Anilist ID found for: ${animeName}`);
      return null;
    }

    console.log(`[Mapping] Found AniList ID: ${anilistId} for ${bestMatch.title?.romaji}`);

    // Get provider mapping
    const mappingRes = await anilist.getMappings(anilistId, targetProvider as AnilistProvider);
    const providerData = mappingRes?.data?.data?.provider;

    if (!providerData?.id) {
      console.log(`[Mapping] No ${targetProvider} mapping for AniList ID: ${anilistId}`);
      return null;
    }

    console.log(`[Mapping] ${targetProvider} ID: ${providerData.id}`);

    return {
      provider: targetProvider,
      animeId: providerData.id,
      name: providerData.name || bestMatch.title?.romaji,
      poster: providerData.image || bestMatch.image,
    };
  } catch (error) {
    console.error(`[Mapping] Error mapping ${animeSlug} to ${targetProvider}:`, error);
    return null;
  }
}

/**
 * Get anime details with automatic AniList mapping fallback
 * Tries direct provider lookup first, then falls back to AniList mapping
 */
export async function getAnimeDetailsWithMapping(
  animeSlug: string,
  preferredProvider: AnimeProvider = 'kaido'
): Promise<ApiResponse<AnimeDetailResponse> | null> {
  const providers: AnimeProvider[] = ['kaido', 'hianime', 'animepahe', 'anizone'];
  
  // Try direct lookup first
  for (const provider of providers) {
    try {
      console.log(`[Details] Trying ${provider} directly: ${animeSlug}`);
      let res: any = null;
      
      switch (provider) {
        case 'kaido':
          res = await kaido.anime(animeSlug);
          break;
        case 'hianime':
          res = await hianime.anime(animeSlug);
          break;
        case 'animepahe':
          res = await animepahe.anime(animeSlug);
          break;
        case 'anizone':
          res = await anizone.anime(animeSlug);
          break;
      }

      if (res?.data) {
        console.log(`[Details] ✓ ${provider} direct lookup succeeded`);
        return res;
      }
    } catch (e) {
      console.log(`[Details] ✗ ${provider} direct lookup failed`);
    }
  }

  // Try AniList mapping
  console.log(`[Details] Trying AniList mapping for: ${animeSlug}`);
  const mapping = await mapAnimeToProvider(animeSlug, preferredProvider);
  
  if (mapping) {
    console.log(`[Details] Using mapped ID: ${mapping.animeId} from ${mapping.provider}`);
    
    switch (mapping.provider) {
      case 'kaido':
        return await kaido.anime(mapping.animeId);
      case 'hianime':
        return await hianime.anime(mapping.animeId);
      case 'animepahe':
        return await animepahe.anime(mapping.animeId);
      case 'anizone':
        return await anizone.anime(mapping.animeId);
    }
  }

  console.log(`[Details] All methods failed for: ${animeSlug}`);
  return null;
}

/**
 * Get anime episodes with automatic AniList mapping fallback
 */
export async function getAnimeEpisodesWithMapping(
  animeSlug: string,
  preferredProvider: AnimeProvider = 'kaido'
): Promise<ApiResponse<any> | null> {
  const providers: AnimeProvider[] = ['kaido', 'hianime', 'animepahe', 'anizone'];
  
  // Try direct lookup first
  for (const provider of providers) {
    try {
      console.log(`[Episodes] Trying ${provider} directly: ${animeSlug}`);
      let res: any = null;
      
      switch (provider) {
        case 'kaido':
          res = await kaido.episodes(animeSlug);
          break;
        case 'hianime':
          res = await hianime.episodes(animeSlug);
          break;
        case 'animepahe':
          res = await animepahe.episodes(animeSlug);
          break;
        case 'anizone':
          res = await anizone.episodes(animeSlug);
          break;
      }

      if (res?.data) {
        console.log(`[Episodes] ✓ ${provider} direct lookup succeeded`);
        return res;
      }
    } catch (e) {
      console.log(`[Episodes] ✗ ${provider} direct lookup failed`);
    }
  }

  // Try AniList mapping
  console.log(`[Episodes] Trying AniList mapping for: ${animeSlug}`);
  const mapping = await mapAnimeToProvider(animeSlug, preferredProvider);
  
  if (mapping) {
    console.log(`[Episodes] Using mapped ID: ${mapping.animeId} from ${mapping.provider}`);
    
    switch (mapping.provider) {
      case 'kaido':
        return await kaido.episodes(mapping.animeId);
      case 'hianime':
        return await hianime.episodes(mapping.animeId);
      case 'animepahe':
        return await animepahe.episodes(mapping.animeId);
      case 'anizone':
        return await anizone.episodes(mapping.animeId);
    }
  }

  console.log(`[Episodes] All methods failed for: ${animeSlug}`);
  return null;
}

// ═════════════════════════════════════════════════════════════════════
// ANILIST META API
// ═════════════════════════════════════════════════════════════════════

export const anilist = {
  // Search
  search: (q: string, page: number = 1, perPage: number = 20): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/anime/search?q=${encodeURIComponent(q)}&page=${page}&perPage=${perPage}`, 3600),

  // Top Anime
  getTop: (category: AnilistTopCategory, format: AnilistFormat = 'TV', page: number = 1, perPage: number = 20): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/anime/top/${category}?format=${format}&page=${page}&perPage=${perPage}`, 3600),

  // Seasonal
  getSeasonal: (season: AnilistSeason, year: number, format: AnilistFormat = 'TV', page: number = 1, perPage: number = 20): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/seasons/${season}/${year}?format=${format}&page=${page}&perPage=${perPage}`, 3600),

  // Anime Details
  getAnime: (id: number): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/anime/${id}`, 3600),

  // Characters
  getCharacters: (id: number): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/anime/${id}/characters`, 3600),

  // Related
  getRelated: (id: number): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/anime/${id}/related`, 3600),

  // Airing Schedule by Date
  getScheduleByDate: (date: string, page: number = 1, perPage: number = 20): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/airing/date/${date}?page=${page}&perPage=${perPage}`, 1800),

  // Media Schedule
  getMediaSchedule: (id: number): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/anime/schedule/${id}`, 3600),

  // Provider Mappings
  getMappings: (id: number, provider: AnilistProvider = 'hianime'): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/mappings/${id}?provider=${provider}`, 3600),

  // Provider Episodes
  getProviderEpisodes: (id: number, provider: AnilistProvider = 'hianime'): Promise<any> =>
    kenjitsuFetch<any>(`/api/anilist/episodes/${id}?provider=${provider}`, 3600),
};

// ─────────────────────────────────────────────
// KAIDO API
// ─────────────────────────────────────────────

export const kaido = {
  home: () => kenjitsuFetch<any>('/kaido/home', 1800),
  search: (query: string, page: number = 1) => kenjitsuFetch<any>(`/kaido/anime/search?q=${encodeURIComponent(query)}&page=${page}`, 3600),
  suggestions: (query: string) => kenjitsuFetch<any>(`/kaido/anime/suggestions?q=${encodeURIComponent(query)}`, 86400),
  genre: (genre: string, page: number = 1) => kenjitsuFetch<any>(`/kaido/anime/genre/${encodeURIComponent(genre)}?page=${page}`, 3600),
  genres: () => kenjitsuFetch<any>('/kaido/anime/genres', 86400),
  category: (category: string, page: number = 1) => kenjitsuFetch<any>(`/kaido/anime/category/${category}?page=${page}`, 3600),
  recent: (status: HiAnimeRecentStatus = 'updated', page: number = 1) => kenjitsuFetch<any>(`/kaido/anime/recent/${status}?page=${page}`, 3600),
  azList: (letter: string, page: number = 1) => kenjitsuFetch<any>(`/kaido/anime/az-list/${letter}?page=${page}`, 3600),
  anime: (animeId: string) => kenjitsuFetch<AnimeDetailResponse>(`/kaido/anime/${animeId}`, 3600),
  episodes: (animeId: string) => kenjitsuFetch<any>(`/kaido/anime/${animeId}/episodes`, 3600),
  servers: (episodeId: string) => kenjitsuFetch<any>(`/kaido/episode/${episodeId}/servers`, 0),
  sources: (episodeId: string, version: SubDubRaw = 'sub', server: KaidoServer = 'vidcloud') => kenjitsuFetch<any>(`/kaido/sources/${episodeId}?version=${version}&server=${server}`, 0),
  topAiring: (page: number = 1) => kenjitsuFetch<any>(`/kaido/anime/top-airing?page=${page}`, 3600),
  producer: (producer: string, page: number = 1) => kenjitsuFetch<any>(`/kaido/anime/producer/${encodeURIComponent(producer)}?page=${page}`, 3600),
  studio: (studio: string, page: number = 1) => kenjitsuFetch<any>(`/kaido/anime/studio/${encodeURIComponent(studio)}?page=${page}`, 3600),
  random: () => kenjitsuFetch<any>('/kaido/anime/random', 0),
  qtip: (animeId: string) => kenjitsuFetch<any>(`/kaido/anime/${animeId}/qtip`, 86400),
};

// ─────────────────────────────────────────────
// HI ANIME API
// ─────────────────────────────────────────────

export const hianime = {
  search: (query: string, page: number = 1) => kenjitsuFetch<any>(`/hianime/anime/search?q=${encodeURIComponent(query)}&page=${page}`, 3600),
  anime: (animeId: string) => kenjitsuFetch<AnimeDetailResponse>(`/hianime/anime/${animeId}`, 3600),
  episodes: (animeId: string) => kenjitsuFetch<any>(`/hianime/anime/${animeId}/episodes`, 3600),
  servers: (episodeId: string) => kenjitsuFetch<any>(`/hianime/episode/${episodeId}/servers`, 0),
  sources: (episodeId: string, version: SubDubRaw = 'sub', server: HiAnimeServer = 'hd-1') => kenjitsuFetch<any>(`/hianime/sources/${episodeId}?version=${version}&server=${server}`, 0),
  home: () => kenjitsuFetch<any>('/hianime/home', 1800),
  genre: (genre: string, page: number = 1) => kenjitsuFetch<any>(`/hianime/anime/genre/${encodeURIComponent(genre)}?page=${page}`, 3600),
  genres: () => kenjitsuFetch<any>('/hianime/anime/genres', 86400),
  recent: (status: HiAnimeRecentStatus = 'updated', page: number = 1) => kenjitsuFetch<any>(`/hianime/anime/recent/${status}?page=${page}`, 3600),
  category: (category: HiAnimeCategory, page: number = 1) => kenjitsuFetch<any>(`/hianime/anime/category/${category}?page=${page}`, 3600),
  topAiring: (page: number = 1) => kenjitsuFetch<any>(`/hianime/anime/top-airing?page=${page}`, 3600),
};

// ─────────────────────────────────────────────
// ANIMEPAHE API
// ─────────────────────────────────────────────

export const animepahe = {
  search: (query: string, page: number = 1) => kenjitsuFetch<any>(`/animepahe/anime/search?q=${encodeURIComponent(query)}&page=${page}`, 3600),
  anime: (animeId: string) => kenjitsuFetch<AnimeDetailResponse>(`/animepahe/anime/${animeId}`, 3600),
  episodes: (animeId: string) => kenjitsuFetch<any>(`/animepahe/anime/${animeId}/episodes`, 3600),
  servers: (episodeId: string) => kenjitsuFetch<any>(`/animepahe/episode/${episodeId}/servers`, 0),
  sources: (episodeId: string, version: SubDubRaw = 'sub') => kenjitsuFetch<any>(`/animepahe/sources/${episodeId}?version=${version}`, 0),
};

// ─────────────────────────────────────────────
// ANIZONE API
// ─────────────────────────────────────────────

export const anizone = {
  search: (query: string, page: number = 1) => kenjitsuFetch<any>(`/anizone/anime/search?q=${encodeURIComponent(query)}&page=${page}`, 3600),
  anime: (animeId: string) => kenjitsuFetch<AnimeDetailResponse>(`/anizone/anime/${animeId}`, 3600),
  episodes: (animeId: string) => kenjitsuFetch<any>(`/anizone/anime/${animeId}/episodes`, 3600),
  servers: (episodeId: string) => kenjitsuFetch<any>(`/anizone/episode/${episodeId}/servers`, 0),
  sources: (episodeId: string) => kenjitsuFetch<any>(`/anizone/sources/${episodeId}`, 0),
};

// ─────────────────────────────────────────────
// HOME PAGE DATA
// ─────────────────────────────────────────────

export const getHomeData = async () => {
  // Try HiAnime first
  let res = await hianime.home();
  if (res?.data) return res;

  // Fallback to Kaido
  res = await kaido.home();
  return res;
};

export const getAZList = async (letter: string, page: number = 1) => {
  // Try Kaido AZ list
  return kaido.azList(letter, page);
};

// ─────────────────────────────────────────────
// ROBUST FETCHING WITH FALLBACKS
// ─────────────────────────────────────────────

export const searchAnime = async (query: string, page: number = 1) => {
  // Try Kaido first (most reliable)
  let res = await kaido.search(query, page);
  if (res?.data) return res;

  // Fallback to HiAnime
  res = await hianime.search(query, page);
  if (res?.data) return res;

  // Fallback to AnimePahe
  res = await animepahe.search(query, page);
  if (res?.data) return res;

  // Fallback to Anizone (may be down)
  res = await anizone.search(query, page);
  return res;
};

export const getAnimeDetails = async (animeId: string) => {
  // Try Kaido first (most reliable)
  let res = await kaido.anime(animeId);
  if (res?.data) return res;

  // Try HiAnime
  res = await hianime.anime(animeId);
  if (res?.data) return res;

  // Fallback to Anizone (may be down)
  res = await anizone.anime(animeId);
  if (res?.data) return res;

  // Try AnimePahe
  res = await animepahe.anime(animeId);
  if (res?.data) return res;

  // Try AniList mapping as last resort
  console.log(`[Details] Trying AniList mapping for: ${animeId}`);
  const mapping = await mapAnimeToProvider(animeId, 'kaido');
  
  if (mapping) {
    switch (mapping.provider) {
      case 'kaido':
        return await kaido.anime(mapping.animeId);
      case 'hianime':
        return await hianime.anime(mapping.animeId);
      case 'animepahe':
        return await animepahe.anime(mapping.animeId);
      case 'anizone':
        return await anizone.anime(mapping.animeId);
    }
  }

  return res;
};
export const getSearchSuggestions = (query: string) => kaido.suggestions(query);
export const getGenreAnime = (genre: string, page: number = 1) => hianime.genre(genre, page);
export const getCategoryAnime = (category: string, page: number = 1) => hianime.category(category as any, page);
export const getCategoryAnimes = getCategoryAnime;
export const getRecentAnime = (status: HiAnimeRecentStatus = 'updated', page: number = 1) => hianime.recent(status, page);
export const getAnimeEpisodes = async (animeId: string): Promise<ApiResponse<any>> => {
  // Try Kaido first (most reliable)
  let res = await kaido.episodes(animeId);
  if (res?.data) return res;

  // Try HiAnime
  res = await hianime.episodes(animeId);
  if (res?.data) return res;

  // Try AnimePahe
  res = await animepahe.episodes(animeId);
  if (res?.data) return res;

  // Try Anizone (may be down)
  res = await anizone.episodes(animeId);
  if (res?.data) return res;

  // Try AniList mapping as last resort
  console.log(`[Episodes] Trying AniList mapping for: ${animeId}`);
  const mapping = await mapAnimeToProvider(animeId, 'kaido');
  
  if (mapping) {
    switch (mapping.provider) {
      case 'kaido':
        return await kaido.episodes(mapping.animeId);
      case 'hianime':
        return await hianime.episodes(mapping.animeId);
      case 'animepahe':
        return await animepahe.episodes(mapping.animeId);
      case 'anizone':
        return await anizone.episodes(mapping.animeId);
    }
  }

  return res;
};
export const getEpisodeServers = (episodeId: string) => getEpisodeServersWithFallback(episodeId);
export const getEpisodeSources = (episodeId: string, provider: AnimeProvider = 'hianime', version: string = 'sub', server: string = 'hd-1') => 
  provider === 'kaido' ? kaido.sources(episodeId, version as SubDubRaw, server as KaidoServer) :
  provider === 'hianime' ? hianime.sources(episodeId, version as SubDubRaw, server as HiAnimeServer) :
  provider === 'animepahe' ? animepahe.sources(episodeId, version as SubDubRaw) :
  anizone.sources(episodeId);

// New direct anizone sources function using the new API endpoint
export const getAnizoneSources = (episodeId: string): Promise<AnizoneSourceResponse | null> => {
  return directFetch<AnizoneSourceResponse>(`${BASE_URL}/anizone/sources/${episodeId}`);
};
export const getTopAiring = (page: number = 1) => hianime.topAiring(page);
export const getRandomAnime = () => kaido.random();
export const getAnimeQtip = (animeId: string) => kaido.qtip(animeId);
export const getGenres = () => hianime.genres();
export const getProducerAnime = (producer: string, page: number = 1) => kaido.producer(producer, page);
export const getStudioAnime = (studio: string, page: number = 1) => kaido.studio(studio, page);

// AniList
export const getSchedule = (date: string) => anilist.getScheduleByDate(date);
export const getSeasonalAnime = (season: string, year: number, page: number = 1) => anilist.getSeasonal(season as AnilistSeason, year, undefined, page);
export const getAnilistMappings = (anilistId: number, provider: AnimeProvider = 'kaido') => anilist.getMappings(anilistId, provider as AnilistProvider);
export const getAnilistEpisodes = (anilistId: number, provider: AnimeProvider = 'kaido') => anilist.getProviderEpisodes(anilistId, provider as AnilistProvider);

// New AniList exports
export const anilistSearchAnime = (query: string, page: number = 1, perPage: number = 20) => anilist.search(query, page, perPage);
export const anilistTopAnime = (category: AnilistTopCategory, format?: AnilistFormat, page: number = 1, perPage: number = 20) => anilist.getTop(category, format || 'TV', page, perPage);
export const anilistSeasonalAnime = (season: AnilistSeason, year: number, format?: AnilistFormat, page: number = 1, perPage: number = 20) => anilist.getSeasonal(season, year, format || 'TV', page, perPage);
export const anilistAiringSchedule = (date: string, page: number = 1, perPage: number = 20) => anilist.getScheduleByDate(date, page, perPage);
export const anilistAnimeDetails = (anilistId: number) => anilist.getAnime(anilistId);
export const anilistCharacters = (anilistId: number) => anilist.getCharacters(anilistId);
export const anilistRelatedAnime = (anilistId: number) => anilist.getRelated(anilistId);
export const anilistAnimeSchedule = (anilistId: number) => anilist.getMediaSchedule(anilistId);

// Providers (Kaido first for reliability)
export const getProviders = (): { id: AnimeProvider; name: string; priority: number }[] => [
  { id: 'kaido', name: 'Kaido', priority: 1 },
  { id: 'hianime', name: 'HiAnime', priority: 2 },
  { id: 'animepahe', name: 'AnimePahe', priority: 3 },
  { id: 'anizone', name: 'Anizone', priority: 4 },
];

export const getProviderName = (provider: AnimeProvider): string => {
  const names: Record<AnimeProvider, string> = {
    anizone: 'Anizone',
    hianime: 'HiAnime',
    kaido: 'Kaido',
    animepahe: 'AnimePahe'
  };
  return names[provider];
};
