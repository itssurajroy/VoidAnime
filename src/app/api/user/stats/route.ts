import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
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

    // Get watchlist
    const { data: watchlist } = await supabaseAdmin
      .from('watchlist')
      .select('*')
      .eq('user_id', uid);
    const wl = watchlist || [];

    // Get favorites count
    const { count: favoritesCount } = await supabaseAdmin
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid);

    // Get reviews count
    const { count: reviewsCount } = await supabaseAdmin
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', uid);

    // Get history
    const { data: history } = await supabaseAdmin
      .from('watch_history')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(100);
    const h = history || [];

    // Calculate stats
    const totalEpisodes = wl.reduce((acc, w: any) => acc + (w.progress || 0), 0);
    const totalDuration = wl.reduce((acc, w: any) => acc + ((w.progress || 0) * 24), 0);

    const stats = {
      totalAnime: wl.length,
      watching: wl.filter((w: any) => w.status === 'WATCHING').length,
      completed: wl.filter((w: any) => w.status === 'COMPLETED').length,
      planToWatch: wl.filter((w: any) => w.status === 'PLAN_TO_WATCH').length,
      onHold: wl.filter((w: any) => w.status === 'ON_HOLD').length,
      dropped: wl.filter((w: any) => w.status === 'DROPPED').length,
      episodesWatched: totalEpisodes,
      hoursWatched: Math.round(totalDuration / 60),
      minutesWatched: totalDuration,
      completionRate: wl.length > 0 
        ? Math.round((wl.filter((w: any) => w.status === 'COMPLETED').length / wl.length) * 100)
        : 0,
      favoritesCount: favoritesCount || 0,
      reviewsCount: reviewsCount || 0,
      historyCount: h.length,
      lastWatched: h[0]?.created_at || null,
      lastUpdated: wl.sort((a: any, b: any) => 
        new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
      )[0]?.updated_at || null,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
