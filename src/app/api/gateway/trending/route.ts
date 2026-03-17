import { NextRequest, NextResponse } from 'next/server';
import { getTrending } from '@/lib/api/anilist';
import { withCache } from '@/lib/cache/withCache';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get('page') ?? '1');
  const perPage = parseInt(request.nextUrl.searchParams.get('perPage') ?? '20');

  try {
    const data = await withCache(`trending:${page}:${perPage}`, () => getTrending(page), { ttl: 600 });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('[Gateway] /trending error:', error);
    return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 });
  }
}
