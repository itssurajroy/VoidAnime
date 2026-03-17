import { NextRequest, NextResponse } from 'next/server';
import { searchAnime } from '@/lib/api/anilist';
import { withCache } from '@/lib/cache/withCache';
import type { SearchFilters, MediaType, MediaStatus, MediaSeason, MediaFormat, MediaSort } from '@/types/anime';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filters: SearchFilters = {
    query: searchParams.get('q') ?? undefined,
    type: (searchParams.get('type') as MediaType) ?? 'ANIME',
    status: (searchParams.get('status') as MediaStatus) ?? undefined,
    season: (searchParams.get('season') as MediaSeason) ?? undefined,
    seasonYear: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
    genres: searchParams.get('genres') ? searchParams.get('genres')!.split(',') : undefined,
    format: (searchParams.get('format') as MediaFormat) ?? undefined,
    sort: (searchParams.get('sort') as MediaSort) ?? 'TRENDING_DESC',
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    perPage: 20,
    isAdult: false,
  };

  const cacheKey = `search:${JSON.stringify(filters)}`;

  try {
    const data = await withCache(cacheKey, () => searchAnime(filters.query || '', filters.page || 1, filters), { ttl: 300 });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[Gateway] /search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
