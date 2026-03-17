import type {
  ApiResponse,
  HomeData,
  AZListData,
  QtipData,
  AnimeDetailsData,
  EpisodeListData,
  EpisodeServersData,
  NextEpisodeSchedule,
  SearchResultsData,
  SearchSuggestionData,
  GenreCategoryData,
  ProducerData,
  ScheduleData
} from '@/types';

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || 'https://void-ivory-beta.vercel.app';

async function apiFetch<T>(endpoint: string, revalidate: number = 3600): Promise<T> {
  // If on server, fetch directly from external API
  // If on client, use the local proxy
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer ? EXTERNAL_API_BASE_URL : '';
  const prefix = '/api';

  const apiEndpoint = `${baseUrl}${prefix}${endpoint}`;

  try {
    const res = await fetch(apiEndpoint, {
      next: { revalidate }
    });

    if (!res.ok) {
      console.error(`API fetch failed: ${res.status} on ${apiEndpoint}`);
      return { status: res.status, data: {} } as T;
    }

    return res.json();
  } catch (error) {
    console.error(`Fetch error on ${apiEndpoint}:`, error);
    return { status: 500, data: {} } as T;
  }
}

/* =========================
   HOME & DISCOVERY
========================= */

export const getHomeData = () => apiFetch<ApiResponse<HomeData>>("/v2/hianime/home", 1800); // 30 mins

export const getAZList = (letter: string, page: number = 1) =>
  apiFetch<ApiResponse<AZListData>>(`/v2/hianime/azlist/${letter}?page=${page}`, 3600); // 1 hour

/* =========================
   ANIME DETAILS
========================= */

export const getAnimeDetails = (animeId: string) =>
  apiFetch<ApiResponse<AnimeDetailsData>>(`/v2/hianime/anime/${animeId}`, 3600); // 1 hour

export const getAnimeEpisodes = (animeId: string) =>
  apiFetch<ApiResponse<EpisodeListData>>(`/v2/hianime/anime/${animeId}/episodes`, 3600); // 1 hour

export const getEpisodeServers = (episodeId: string) =>
  apiFetch<ApiResponse<EpisodeServersData>>(`/v2/hianime/episode/servers?animeEpisodeId=${encodeURIComponent(episodeId)}`, 0); // Don't cache streaming servers

export const getEpisodeSources = (episodeId: string, server: string = 'hd-1', category: string = 'sub') =>
  apiFetch<ApiResponse<any>>(`/v2/hianime/episode/sources?animeEpisodeId=${encodeURIComponent(episodeId)}&server=${encodeURIComponent(server)}&category=${encodeURIComponent(category)}`, 0); // Don't cache streaming links

export const getNextEpisodeSchedule = (animeId: string) =>
  apiFetch<ApiResponse<NextEpisodeSchedule>>(`/v2/hianime/schedule?animeId=${animeId}`, 1800); // 30 mins

export const getAnimeQtip = (animeId: string) =>
  apiFetch<{ success: boolean; data: QtipData }>(`/v2/hianime/qtip/${animeId}`, 86400); // 24 hours (mostly static)

/* =========================
   SEARCH
========================= */

export const searchAnime = (
  query: string,
  page: number | Record<string, string | number> = 1,
  filters: Record<string, string | number> = {}
) => {
  const actualPage = typeof page === 'number' ? page : (page.page || 1);
  const actualFilters = typeof page === 'object' ? page : filters;

  const params = new URLSearchParams({
    q: query,
    page: actualPage.toString(),
    ...Object.fromEntries(
      Object.entries(actualFilters)
        .filter(([key]) => key !== 'q' && key !== 'page')
        .map(([key, value]) => [key, value.toString()])
    )
  });
  return apiFetch<ApiResponse<SearchResultsData>>(`/v2/hianime/search?${params.toString()}`, 3600);
};

export const getSearchSuggestions = (query: string) =>
  apiFetch<ApiResponse<SearchSuggestionData>>(`/v2/hianime/search/suggestion?q=${query}`, 86400); // 24 hours

/* =========================
   GENRES & CATEGORIES
========================= */

export const getGenreAnime = (genreName: string, page: number = 1) =>
  apiFetch<ApiResponse<GenreCategoryData>>(`/v2/hianime/genre/${genreName}?page=${page}`, 3600);

export const getGenreAnimes = getGenreAnime;

export const getCategoryAnime = (categoryName: string, page: number = 1) =>
  apiFetch<ApiResponse<GenreCategoryData>>(`/v2/hianime/category/${categoryName}?page=${page}`, 3600);

export const getCategoryAnimes = getCategoryAnime;

export const getProducerAnime = (producerName: string, page: number = 1) =>
  apiFetch<ApiResponse<ProducerData>>(`/v2/hianime/producer/${producerName}?page=${page}`, 3600);

export const getProducerAnimes = getProducerAnime;

/* =========================
   SCHEDULE
 ========================= */

export const getSchedule = (date: string) =>
  apiFetch<ApiResponse<ScheduleData>>(`/v2/hianime/schedule?date=${date}`, 1800);
