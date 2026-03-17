const ANIWATCH_BASE = '/api/aniwatch';

export interface AniwatchSearchResult {
  id: string;
  name: string;
  poster: string;
  duration: string;
  type: string;
  rating: string;
  episodes: {
    sub: number;
    dub: number;
  };
}

export interface AniwatchSearchResponse {
  success: boolean;
  data: {
    animes: AniwatchSearchResult[];
    mostPopularAnimes?: any[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    searchQuery: string;
    searchFilters: Record<string, any>;
  };
}

export interface AniwatchSuggestion {
  id: string;
  name: string;
  poster: string;
  jname: string;
  moreInfo: string[];
}

export interface AniwatchSuggestionResponse {
  success: boolean;
  data: {
    suggestions: AniwatchSuggestion[];
  };
}

export interface AdvancedSearchFilters {
  genres?: string;
  type?: string;
  sort?: string;
  season?: string;
  language?: string;
  status?: string;
  rated?: string;
  start_date?: string;
  end_date?: string;
  score?: string;
}

export interface AniwatchEpisode {
  number: number;
  title: string;
  episodeId: string;
  isFiller: boolean;
}

export interface AniwatchEpisodesResponse {
  success: boolean;
  data: {
    totalEpisodes: number;
    episodes: AniwatchEpisode[];
  };
}

export interface AniwatchServer {
  serverId: number;
  serverName: string;
}

export interface AniwatchServersResponse {
  success: boolean;
  data: {
    episodeId: string;
    episodeNo: number;
    sub: AniwatchServer[];
    dub: AniwatchServer[];
    raw: AniwatchServer[];
  };
}

export interface AniwatchSource {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface AniwatchTrack {
  file: string;
  label?: string;
  kind?: string;
  default?: boolean;
}

export interface AniwatchStreamingResponse {
  success: boolean;
  data: {
    headers: Record<string, string>;
    sources: AniwatchSource[];
    subtitles: AniwatchTrack[];
    download?: string;
  };
}

export async function searchAnime(
  query: string, 
  page: number = 1, 
  filters?: AdvancedSearchFilters
): Promise<AniwatchSearchResponse> {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const res = await fetch(`${ANIWATCH_BASE}/search?${params.toString()}`);
  return res.json();
}

export async function getSearchSuggestions(query: string): Promise<AniwatchSuggestionResponse> {
  const res = await fetch(`${ANIWATCH_BASE}/search/suggestion?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function getAnimeInfo(animeId: string): Promise<any> {
  const res = await fetch(`${ANIWATCH_BASE}/anime/${animeId}`);
  return res.json();
}

export async function getAnimeEpisodes(animeId: string): Promise<AniwatchEpisodesResponse> {
  const res = await fetch(`${ANIWATCH_BASE}/anime/${animeId}/episodes`);
  return res.json();
}

export async function getEpisodeServers(episodeId: string): Promise<AniwatchServersResponse> {
  const res = await fetch(`${ANIWATCH_BASE}/episode/servers?animeEpisodeId=${encodeURIComponent(episodeId)}`);
  return res.json();
}

export async function getStreamingLinks(
  episodeId: string,
  server: string = 'vidstreaming',
  category: string = 'sub'
): Promise<AniwatchStreamingResponse> {
  const res = await fetch(
    `${ANIWATCH_BASE}/episode/sources?animeEpisodeId=${encodeURIComponent(episodeId)}&server=${server}&category=${category}`
  );
  return res.json();
}

export function getQualityOptions(sources: AniwatchSource[]): string[] {
  const qualities = sources.map(s => s.quality).filter(Boolean);
  const unique = [...new Set(qualities)];
  return unique.sort((a, b) => {
    const aNum = parseInt(a.replace('p', ''));
    const bNum = parseInt(b.replace('p', ''));
    return bNum - aNum;
  });
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatDownloadFilename(animeName: string, episodeNumber: number, extension: string = 'mp4'): string {
  const sanitized = sanitizeFilename(animeName);
  return `${sanitized} Episode ${episodeNumber}.${extension}`;
}
