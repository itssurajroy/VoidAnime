import { NextRequest, NextResponse } from 'next/server';
import { getSeasonalAnime } from '@/lib/api/anilist';
import { withCache } from '@/lib/cache/withCache';
import type { MediaSeason } from '@/types/anime';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const season = (searchParams.get('season') as MediaSeason) ?? 'SPRING';
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()));
  const page = parseInt(searchParams.get('page') ?? '1');

  try {
    const data = await withCache(
      `seasonal:${season}:${year}:${page}`,
      () => getSeasonalAnime(season, year, page),
      { ttl: 1800 }
    );
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[Gateway] /seasonal error:', error);
    return NextResponse.json({ error: 'Failed to fetch seasonal' }, { status: 500 });
  }
}
