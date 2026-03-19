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

    // Export user data
    const exportData: any = {
      exportedAt: new Date().toISOString(),
      user: {
        uid,
        email: user.email,
        displayName: user.user_metadata?.full_name || user.user_metadata?.username || null,
        photoURL: user.user_metadata?.avatar_url || null,
        emailVerified: user.email_confirmed_at ? true : false,
        createdAt: user.created_at,
      },
    };

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle();
    exportData.profile = profile || null;

    // Get watchlist
    const { data: watchlist } = await supabaseAdmin
      .from('watchlist')
      .select('*')
      .eq('user_id', uid);
    exportData.watchlist = watchlist || [];

    // Get favorites
    const { data: favorites } = await supabaseAdmin
      .from('favorites')
      .select('*')
      .eq('user_id', uid);
    exportData.favorites = favorites || [];

    // Get reviews
    const { data: reviews } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('user_id', uid);
    exportData.reviews = reviews || [];

    // Get watch history (last 100)
    const { data: watchHistory } = await supabaseAdmin
      .from('watch_history')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(100);
    exportData.watchHistory = watchHistory || [];

    // Calculate stats
    const wl = exportData.watchlist || [];
    exportData.stats = {
      totalAnime: wl.length,
      watching: wl.filter((w: any) => w.status === 'WATCHING').length,
      completed: wl.filter((w: any) => w.status === 'COMPLETED').length,
      planToWatch: wl.filter((w: any) => w.status === 'PLAN_TO_WATCH').length,
      onHold: wl.filter((w: any) => w.status === 'ON_HOLD').length,
      dropped: wl.filter((w: any) => w.status === 'DROPPED').length,
      episodesWatched: wl.reduce((acc: number, w: any) => acc + (w.progress || 0), 0),
      reviewsCount: (exportData.reviews || []).length,
      favoritesCount: (exportData.favorites || []).length,
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
