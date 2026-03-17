const KITSU_BASE = 'https://kitsu.io/api/edge';

const kitsuHeaders = {
  Accept: 'application/vnd.api+json',
  'Content-Type': 'application/vnd.api+json',
};

async function kitsuFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${KITSU_BASE}${path}`, {
      headers: kitsuHeaders,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export interface KitsuAnimeAttributes {
  canonicalTitle: string;
  synopsis: string | null;
  averageRating: string | null;
  startDate: string | null;
  endDate: string | null;
  episodeCount: number | null;
  episodeLength: number | null;
  posterImage?: { large?: string; medium?: string; small?: string };
  coverImage?: { large?: string; topOffset?: number };
  subtype?: string;
  status?: string;
}

export interface KitsuAnime {
  id: string;
  type: string;
  attributes: KitsuAnimeAttributes;
}

export interface KitsuEpisodeAttributes {
  canonicalTitle: string | null;
  number: number;
  relativeNumber: number | null;
  airdate: string | null;
  length: number | null;
  thumbnail?: { original?: string };
  synopsis: string | null;
}

export async function getKitsuAnime(kitsuId: string): Promise<KitsuAnime | null> {
  const data = await kitsuFetch<{ data: KitsuAnime }>(`/anime/${kitsuId}`);
  return data?.data ?? null;
}

export async function searchKitsuByTitle(title: string): Promise<KitsuAnime | null> {
  const encoded = encodeURIComponent(title);
  const data = await kitsuFetch<{ data: KitsuAnime[] }>(`/anime?filter[text]=${encoded}&page[limit]=1`);
  return data?.data?.[0] ?? null;
}

export async function getKitsuEpisodes(kitsuId: string): Promise<KitsuEpisodeAttributes[]> {
  const data = await kitsuFetch<{ data: { id: string; attributes: KitsuEpisodeAttributes }[] }>(
    `/anime/${kitsuId}/episodes?page[limit]=20&sort=number`
  );
  return data?.data?.map((ep) => ep.attributes) ?? [];
}

export async function getKitsuStreamingLinks(kitsuId: string): Promise<{ site: string; url: string }[]> {
  const data = await kitsuFetch<{
    data: { id: string; attributes: { url: string }; relationships: { streamer: { data: { id: string } } } }[];
    included?: { id: string; type: string; attributes: { siteName: string } }[];
  }>(`/anime/${kitsuId}/streaming-links?include=streamer`);

  if (!data?.data) return [];

  return data.data.map((link) => {
    const streamerId = link.relationships?.streamer?.data?.id;
    const streamer = data.included?.find((i) => i.id === streamerId && i.type === 'streamers');
    return {
      site: streamer?.attributes?.siteName ?? 'Unknown',
      url: link.attributes?.url ?? '',
    };
  });
}
