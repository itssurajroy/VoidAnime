const JIKAN_BASE = 'https://api.jikan.moe/v4';

async function jikanFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${JIKAN_BASE}${path}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export interface JikanAnimeData {
  mal_id: number;
  title_english: string | null;
  synopsis: string | null;
  score: number | null;
  rank: number | null;
  popularity: number | null;
  status: string | null;
  episodes: number | null;
}

export interface JikanEpisodeData {
  mal_id: number;
  title: string | null;
  title_romaji: string | null;
  aired: string | null;
  score: number | null;
  filler: boolean;
  recap: boolean;
}

export interface JikanReviewData {
  mal_id: number;
  url: string;
  reviewer: { username: string; url: string; image_url?: string };
  review: string;
  score: number;
  is_spoiler: boolean;
  date: string;
}

export interface JikanStaffData {
  person: { mal_id: number; name: string; url: string; images?: { jpg?: { image_url?: string } } };
  positions: string[];
}

export async function getJikanAnime(malId: number): Promise<JikanAnimeData | null> {
  const data = await jikanFetch<{ data: JikanAnimeData }>(`/anime/${malId}`);
  return data?.data ?? null;
}

export async function getJikanEpisodes(malId: number, page = 1): Promise<JikanEpisodeData[]> {
  const data = await jikanFetch<{ data: JikanEpisodeData[]; pagination: { has_next_page: boolean } }>(
    `/anime/${malId}/episodes?page=${page}`
  );
  if (!data?.data) return [];
  // Recursively fetch all pages (max 5 pages to avoid rate limits)
  if (data.pagination?.has_next_page && page < 5) {
    await new Promise((r) => setTimeout(r, 350)); // Jikan rate limit
    const more = await getJikanEpisodes(malId, page + 1);
    return [...data.data, ...more];
  }
  return data.data;
}

export async function getJikanReviews(malId: number): Promise<JikanReviewData[]> {
  const data = await jikanFetch<{ data: JikanReviewData[] }>(`/anime/${malId}/reviews`);
  return data?.data ?? [];
}

export async function getJikanStaff(malId: number): Promise<JikanStaffData[]> {
  const data = await jikanFetch<{ data: JikanStaffData[] }>(`/anime/${malId}/staff`);
  return data?.data ?? [];
}

const DAY_MAP: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

export interface JikanScheduleAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: { jpg: { image_url: string; small_image_url: string; large_image_url: string } };
  synopsis: string | null;
  score: number | null;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: { string: string };
  duration: string;
  studios: { name: string }[];
  genres: { name: string }[];
  season: string | null;
  year: number | null;
}

export async function fetchTodayAiring(): Promise<JikanScheduleAnime[]> {
  const today = new Date().getDay();
  const day = DAY_MAP[today] || 'monday';
  const data = await jikanFetch<{ data: JikanScheduleAnime[] }>(`/schedules?filter=${day}&limit=20`);
  return data?.data ?? [];
}

export async function fetchUpcomingAnime(): Promise<JikanScheduleAnime[]> {
  const data = await jikanFetch<{ data: JikanScheduleAnime[] }>('/top/anime?filter=upcoming&limit=12');
  return data?.data ?? [];
}

export async function fetchOnThisDay(month: number, day: number): Promise<JikanScheduleAnime[]> {
  const startDate = `${month}-${day}`;
  const data = await jikanFetch<{ data: JikanScheduleAnime[] }>(`/anime?start_date=${startDate}&sort=score&limit=10`);
  return data?.data ?? [];
}
