import { NextRequest, NextResponse } from 'next/server';
import { getAiringSchedule } from '@/lib/api/anilist';
import { withCache } from '@/lib/cache/withCache';

export async function GET(request: NextRequest) {
  const now = Math.floor(Date.now() / 1000);
  const weekStart = parseInt(request.nextUrl.searchParams.get('from') ?? String(now));
  const weekEnd = parseInt(request.nextUrl.searchParams.get('to') ?? String(now + 7 * 24 * 3600));

  try {
    const data = await withCache(`airing:${weekStart}:${weekEnd}`, () => getAiringSchedule(weekStart, weekEnd), { ttl: 900 });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[Gateway] /airing error:', error);
    return NextResponse.json({ error: 'Failed to fetch airing schedule' }, { status: 500 });
  }
}
