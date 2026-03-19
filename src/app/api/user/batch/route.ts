import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ message: 'Server not configured' }, { status: 500 });
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('sb-access-token')?.value || cookieStore.get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(sessionCookie);
    if (error || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const uid = user.id;
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'clearHistory': {
        const { error: deleteError, count } = await supabaseAdmin
          .from('watch_history')
          .delete({ count: 'exact' })
          .eq('user_id', uid);
        
        if (deleteError) throw deleteError;

        return NextResponse.json({ 
          message: 'History cleared', 
          cleared: count || 0 
        });
      }

      case 'clearFavorites': {
        const { error: deleteError, count } = await supabaseAdmin
          .from('favorites')
          .delete({ count: 'exact' })
          .eq('user_id', uid);
        
        if (deleteError) throw deleteError;

        return NextResponse.json({ 
          message: 'Favorites cleared', 
          cleared: count || 0 
        });
      }

      case 'clearReviews': {
        const { error: deleteError, count } = await supabaseAdmin
          .from('reviews')
          .delete({ count: 'exact' })
          .eq('user_id', uid);
        
        if (deleteError) throw deleteError;

        return NextResponse.json({ 
          message: 'Reviews cleared', 
          cleared: count || 0 
        });
      }

      case 'updateWatchlistStatus': {
        const { animeId, status } = data;
        if (!animeId || !status) {
          return NextResponse.json({ message: 'Missing animeId or status' }, { status: 400 });
        }

        const { error: updateError } = await supabaseAdmin
          .from('watchlist')
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', uid)
          .eq('anime_id', animeId);

        if (updateError) throw updateError;

        return NextResponse.json({ message: 'Status updated' });
      }

      case 'bulkUpdateStatus': {
        const { animeIds, status } = data;
        if (!animeIds || !Array.isArray(animeIds) || !status) {
          return NextResponse.json({ message: 'Missing animeIds or status' }, { status: 400 });
        }

        const { error: updateError } = await supabaseAdmin
          .from('watchlist')
          .update({
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', uid)
          .in('anime_id', animeIds);

        if (updateError) throw updateError;

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

        const { error: deleteError } = await supabaseAdmin
          .from('watchlist')
          .delete()
          .eq('user_id', uid)
          .eq('anime_id', animeId);

        if (deleteError) throw deleteError;

        return NextResponse.json({ message: 'Removed from watchlist' });
      }

      case 'removeFromFavorites': {
        const { animeId } = data;
        if (!animeId) {
          return NextResponse.json({ message: 'Missing animeId' }, { status: 400 });
        }

        const { error: deleteError } = await supabaseAdmin
          .from('favorites')
          .delete()
          .eq('user_id', uid)
          .eq('anime_id', animeId);

        if (deleteError) throw deleteError;

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
