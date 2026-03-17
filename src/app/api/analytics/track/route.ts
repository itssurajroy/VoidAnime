import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ message: 'Server not configured' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    let uid = null;
    let userEmail = null;
    if (sessionCookie && auth) {
      try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie);
        uid = decodedClaims.uid;
        userEmail = decodedClaims.email || null;
      } catch {
        // Continue without auth
      }
    }

    const body = await request.json();
    const { event, data } = body;

    if (!event) {
      return NextResponse.json({ message: 'Missing event type' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    const analyticsRef = db.collection('analytics').doc();
    
    const eventData = {
      event,
      data,
      uid,
      userEmail,
      timestamp,
      userAgent,
      ip,
      url: data?.url || request.headers.get('referer') || '/',
      sessionId: cookieStore.get('session_id')?.value || null,
    };

    await analyticsRef.set(eventData);

    if (uid) {
      const userAnalyticsRef = db.collection('users').doc(uid).collection('analytics').doc(event);
      
      await userAnalyticsRef.set({
        event,
        lastTriggered: timestamp,
        count: 0,
      }, { merge: true });
      
      await userAnalyticsRef.update({
        count: FieldValue.increment(1),
        lastTriggered: timestamp,
      });

      const userRef = db.collection('users').doc(uid);
      await userRef.update({
        lastActiveAt: timestamp,
      } as any);
    }

    switch (event) {
      case 'page_view': {
        await updateDailyStats('views');
        break;
      }

      case 'episode_watch_start': {
        await updateDailyStats('episodesStarted');
        
        if (uid && data.animeId && data.episodeNumber) {
          const watchSessionRef = db.collection('watchSessions').doc();
          await watchSessionRef.set({
            userId: uid,
            animeId: data.animeId,
            animeTitle: data.animeTitle,
            episodeId: data.episodeId,
            episodeNumber: data.episodeNumber,
            startedAt: timestamp,
            status: 'watching',
          });
        }
        break;
      }

      case 'episode_watch_complete': {
        await updateDailyStats('episodesCompleted');
        
        if (uid && data.animeId && data.episodeNumber) {
          const watchHistoryRef = db.collection('users').doc(uid)
            .collection('watchHistory').doc(data.episodeId);
          
          await watchHistoryRef.set({
            animeId: data.animeId,
            animeTitle: data.animeTitle,
            episodeNumber: data.episodeNumber,
            watchedAt: timestamp,
            duration: data.watchDuration || 0,
          }, { merge: true });

          const watchlistRef = db.collection('users').doc(uid)
            .collection('watchlist').doc(data.animeId);
          await watchlistRef.set({
            progress: data.episodeNumber,
            updatedAt: timestamp,
          }, { merge: true });
        }
        break;
      }

      case 'episode_watch_exit': {
        if (uid && data.animeId && data.episodeNumber && data.watchDuration) {
          const watchTimeMinutes = Math.floor(data.watchDuration / 60);
          await updateDailyStats('watchTime', watchTimeMinutes);
        }
        break;
      }

      case 'anime_added': {
        if (uid && data.animeId && data.status) {
          const watchlistRef = db.collection('users').doc(uid)
            .collection('watchlist').doc(data.animeId);
          await watchlistSet({
            animeId: data.animeId,
            animeTitle: data.animeTitle,
            poster: data.poster,
            status: data.status,
            totalEpisodes: data.totalEpisodes || 0,
            addedAt: timestamp,
          });
        }
        break;
      }

      case 'status_changed': {
        if (uid && data.animeId && data.status) {
          const watchlistRef = db.collection('users').doc(uid)
            .collection('watchlist').doc(data.animeId);
          await watchlistRef.update({
            status: data.status,
            updatedAt: timestamp,
          });
        }
        break;
      }

      case 'review_created': {
        if (uid && data.animeId && data.rating) {
          const reviewsRef = db.collection('users').doc(uid)
            .collection('reviews').doc();
          await reviewsRef.set({
            animeId: data.animeId,
            animeTitle: data.animeTitle,
            animePoster: data.animePoster,
            rating: data.rating,
            content: data.content || '',
            createdAt: timestamp,
            updatedAt: timestamp,
          });
        }
        break;
      }

      case 'favorite_added': {
        if (uid && data.animeId) {
          const favoritesRef = db.collection('users').doc(uid)
            .collection('favorites').doc(data.animeId);
          await favoritesRef.set({
            animeId: data.animeId,
            animeTitle: data.animeTitle,
            poster: data.poster,
            addedAt: timestamp,
          });
        }
        break;
      }

      case 'search_query': {
        if (data.query) {
          const searchRef = db.collection('searches').doc();
          await searchRef.set({
            query: data.query,
            resultsCount: data.resultsCount || 0,
            userId: uid,
            timestamp,
          });
        }
        break;
      }

      case 'signup': {
        await updateDailyStats('signups');
        break;
      }

      case 'login': {
        await updateDailyStats('logins');
        break;
      }

      case 'share': {
        const shareRef = db.collection('shares').doc();
        await shareRef.set({
          contentType: data.contentType,
          contentId: data.contentId,
          platform: data.platform,
          userId: uid,
          timestamp,
        });
        break;
      }
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

async function updateDailyStats(field: string, incrementBy: number = 1) {
  if (!db) return;

  const today = new Date().toISOString().split('T')[0];
  const dailyRef = db.collection('analytics').doc('daily').collection('stats').doc(today);

  try {
    await dailyRef.set({
      [field]: FieldValue.increment(incrementBy),
      date: today,
    }, { merge: true });
  } catch (error) {
    console.error('Failed to update daily stats:', error);
  }
}

async function watchlistSet(data: {
  animeId: string;
  animeTitle: string;
  poster?: string;
  status: string;
  totalEpisodes?: number;
  addedAt: string;
}) {
  if (!db || !data.animeId) return;

  try {
    const watchlistRef = db.collection('users').doc().collection('watchlist').doc(data.animeId);
    await watchlistRef.set({
      id: data.animeId,
      name: data.animeTitle,
      poster: data.poster,
      status: data.status,
      progress: 0,
      totalEpisodes: data.totalEpisodes || 0,
      addedAt: data.addedAt,
      updatedAt: data.addedAt,
    });
  } catch (error) {
    console.error('Failed to update watchlist:', error);
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Analytics tracking endpoint',
    events: [
      'page_view',
      'episode_watch_start',
      'episode_watch_complete',
      'episode_watch_exit',
      'anime_added',
      'status_changed',
      'review_created',
      'favorite_added',
      'search_query',
      'signup',
      'login',
      'share',
    ]
  });
}
