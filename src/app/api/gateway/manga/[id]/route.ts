import { NextResponse } from 'next/server';
import { getMangaById } from '@/lib/api/anilist';
import { withCache } from '@/lib/cache/withCache';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/cache/withCache';
import { getMangaDexLiveChapters } from '@/lib/api/mangadex';

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const mergedData = await withCache(
      `manga-full:${id}`,
      async () => {
        const anilistData = await getMangaById(id);
        const media = anilistData?.Media;

        if (!media) throw new Error('Manga not found');

        // Resolve live data from MangaDex
        const title = media.title.english || media.title.romaji;
        const [mangadexData] = await Promise.all([
          getMangaDexLiveChapters(title)
        ]);

        return {
          ...media,
          mangadexData, // { mangadexId, liveChapterCount, liveVolumeCount, status }
        };
      },
      { ttl: 3600 }
    );

    return NextResponse.json(mergedData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
