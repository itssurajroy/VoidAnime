import { NextResponse } from 'next/server';
import { updateListEntry, addActivityEvent } from '@/lib/firebase/firestore';
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/cache/withCache';

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: '@upstash/ratelimit/autowatch',
});

export async function POST(request: Request) {
  // 1. Rate limiting
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  try {
    const body = await request.json();
    const { uid, animeId, episode, mediaTitle, mediaCover, platform } = body;

    if (!uid || !animeId || !episode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Update Firestore
    // We update progress if the reported episode is greater than current progress
    await updateListEntry(uid, animeId, {
      progress: episode,
      status: 'WATCHING',
      updatedAt: new Date().toISOString()
    });

    // 3. Log Activity
    await addActivityEvent(uid, {
      type: 'WATCHED_EPISODE',
      mediaId: animeId,
      mediaTitle,
      mediaCover,
      value: episode,
      platform: platform || 'Unknown',
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, episode });
  } catch (error) {
    console.error('Auto-watch sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
