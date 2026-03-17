import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, auth } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
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
    const userId = decodedClaims.email?.split('@')[0] || uid;

    // Get user auth data
    let userRecord;
    try {
      userRecord = await auth.getUser(uid);
    } catch {
      userRecord = null;
    }

    // Export user data from Firestore
    const exportData: any = {
      exportedAt: new Date().toISOString(),
      user: {
        uid,
        email: decodedClaims.email,
        displayName: userRecord?.displayName || null,
        photoURL: userRecord?.photoURL || null,
        emailVerified: userRecord?.emailVerified || false,
        createdAt: userRecord?.metadata?.creationTime || null,
      },
    };

    // Get user profile
    try {
      const profileSnap = await db.collection('users').doc(uid).get();
      if (profileSnap.exists) {
        exportData.profile = profileSnap.data();
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
    }

    // Get watchlist
    try {
      const watchlistSnap = await db.collection('users').doc(uid).collection('watchlist').get();
      exportData.watchlist = watchlistSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Error fetching watchlist:', e);
      exportData.watchlist = [];
    }

    // Get favorites
    try {
      const favoritesSnap = await db.collection('users').doc(uid).collection('favorites').get();
      exportData.favorites = favoritesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Error fetching favorites:', e);
      exportData.favorites = [];
    }

    // Get reviews
    try {
      const reviewsSnap = await db.collection('users').doc(uid).collection('reviews').get();
      exportData.reviews = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Error fetching reviews:', e);
      exportData.reviews = [];
    }

    // Get watch history (last 100)
    try {
      const historySnap = await db.collection('users').doc(uid).collection('watchHistory')
        .orderBy('watchedAt', 'desc')
        .limit(100)
        .get();
      exportData.watchHistory = historySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error('Error fetching history:', e);
      exportData.watchHistory = [];
    }

    // Calculate stats
    const watchlist = exportData.watchlist || [];
    exportData.stats = {
      totalAnime: watchlist.length,
      watching: watchlist.filter((w: any) => w.status === 'WATCHING').length,
      completed: watchlist.filter((w: any) => w.status === 'COMPLETED').length,
      planToWatch: watchlist.filter((w: any) => w.status === 'PLAN_TO_WATCH').length,
      onHold: watchlist.filter((w: any) => w.status === 'ON_HOLD').length,
      dropped: watchlist.filter((w: any) => w.status === 'DROPPED').length,
      episodesWatched: watchlist.reduce((acc: number, w: any) => acc + (w.progress || 0), 0),
      reviewsCount: (exportData.reviews || []).length,
      favoritesCount: (exportData.favorites || []).length,
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
