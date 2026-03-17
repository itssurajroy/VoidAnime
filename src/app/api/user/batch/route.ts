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
    const body = await request.json();
    const { action, data } = body;

    const userRef = db.collection('users').doc(uid);

    switch (action) {
      case 'clearHistory': {
        const historyRef = userRef.collection('watchHistory');
        const snapshot = await historyRef.limit(100).get();
        
        if (snapshot.empty) {
          return NextResponse.json({ message: 'No history to clear', cleared: 0 });
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        return NextResponse.json({ 
          message: 'History cleared', 
          cleared: snapshot.size 
        });
      }

      case 'clearFavorites': {
        const favoritesRef = userRef.collection('favorites');
        const snapshot = await favoritesRef.limit(100).get();
        
        if (snapshot.empty) {
          return NextResponse.json({ message: 'No favorites to clear', cleared: 0 });
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        return NextResponse.json({ 
          message: 'Favorites cleared', 
          cleared: snapshot.size 
        });
      }

      case 'clearReviews': {
        const reviewsRef = userRef.collection('reviews');
        const snapshot = await reviewsRef.limit(100).get();
        
        if (snapshot.empty) {
          return NextResponse.json({ message: 'No reviews to clear', cleared: 0 });
        }

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        return NextResponse.json({ 
          message: 'Reviews cleared', 
          cleared: snapshot.size 
        });
      }

      case 'updateWatchlistStatus': {
        const { animeId, status } = data;
        if (!animeId || !status) {
          return NextResponse.json({ message: 'Missing animeId or status' }, { status: 400 });
        }

        const watchlistRef = userRef.collection('watchlist').doc(animeId);
        await watchlistRef.update({
          status,
          updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ message: 'Status updated' });
      }

      case 'bulkUpdateStatus': {
        const { animeIds, status } = data;
        if (!animeIds || !Array.isArray(animeIds) || !status) {
          return NextResponse.json({ message: 'Missing animeIds or status' }, { status: 400 });
        }

        const batch = db.batch();
        animeIds.forEach((animeId: string) => {
          const docRef = userRef.collection('watchlist').doc(animeId);
          batch.update(docRef, {
            status,
            updatedAt: new Date().toISOString(),
          });
        });
        await batch.commit();

        return NextResponse.json({ 
          message: 'Bulk update complete', 
          updated: animeIds.length 
        });
      }

      case 'removeFromWatchlist': {
        const { animeId } = data;
        if (!animeId) {
          return NextResponse.json({ message: 'Missing animeId' }, { status: 400 });
        }

        await userRef.collection('watchlist').doc(animeId).delete();

        return NextResponse.json({ message: 'Removed from watchlist' });
      }

      case 'removeFromFavorites': {
        const { animeId } = data;
        if (!animeId) {
          return NextResponse.json({ message: 'Missing animeId' }, { status: 400 });
        }

        await userRef.collection('favorites').doc(animeId).delete();

        return NextResponse.json({ message: 'Removed from favorites' });
      }

      default:
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Batch error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
