import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, auth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    if (!db || !auth) {
      return NextResponse.json({ message: 'Server not configured' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let decodedClaims;
    try {
      decodedClaims = await auth.verifySessionCookie(sessionCookie);
    } catch {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const uid = decodedClaims.uid;

    // Get watchlist
    const watchlistSnap = await db.collection('users').doc(uid).collection('watchlist').get();
    const watchlist = watchlistSnap.docs.map(doc => doc.data());

    // Get favorites count
    const favoritesSnap = await db.collection('users').doc(uid).collection('favorites').count().get();
    const favoritesCount = favoritesSnap.data().count;

    // Get reviews count
    const reviewsSnap = await db.collection('users').doc(uid).collection('reviews').count().get();
    const reviewsCount = reviewsSnap.data().count;

    // Get history
    const historySnap = await db.collection('users').doc(uid).collection('watchHistory')
      .orderBy('watchedAt', 'desc')
      .limit(100)
      .get();
    const history = historySnap.docs.map(doc => doc.data());

    // Calculate stats
    const totalEpisodes = watchlist.reduce((acc, w: any) => acc + (w.progress || 0), 0);
    const totalDuration = watchlist.reduce((acc, w: any) => acc + ((w.progress || 0) * 24), 0);

    const stats = {
      totalAnime: watchlist.length,
      watching: watchlist.filter((w: any) => w.status === 'WATCHING').length,
      completed: watchlist.filter((w: any) => w.status === 'COMPLETED').length,
      planToWatch: watchlist.filter((w: any) => w.status === 'PLAN_TO_WATCH').length,
      onHold: watchlist.filter((w: any) => w.status === 'ON_HOLD').length,
      dropped: watchlist.filter((w: any) => w.status === 'DROPPED').length,
      episodesWatched: totalEpisodes,
      hoursWatched: Math.round(totalDuration / 60),
      minutesWatched: totalDuration,
      completionRate: watchlist.length > 0 
        ? Math.round((watchlist.filter((w: any) => w.status === 'COMPLETED').length / watchlist.length) * 100)
        : 0,
      favoritesCount,
      reviewsCount,
      historyCount: history.length,
      lastWatched: history[0]?.watchedAt || null,
      lastUpdated: watchlist.sort((a: any, b: any) => 
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      )[0]?.updatedAt || null,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
