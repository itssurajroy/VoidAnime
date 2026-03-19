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

    let uid = null;
    let userEmail = null;
    if (sessionCookie) {
      try {
        const { data: { user } } = await supabaseAdmin.auth.getUser(sessionCookie);
        if (user) {
          uid = user.id;
          userEmail = user.email || null;
        }
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

    const eventData = {
      event,
      data,
      user_id: uid,
      user_email: userEmail,
      timestamp,
      user_agent: userAgent,
      ip,
      url: data?.url || request.headers.get('referer') || '/',
      session_id: cookieStore.get('session_id')?.value || null,
    };

    await supabaseAdmin.from('analytics').insert(eventData);

    if (uid) {
      await supabaseAdmin
        .from('users')
        .update({ updated_at: timestamp })
        .eq('id', uid);
    }

    switch (event) {
      case 'page_view': {
        await updateDailyStats('views');
        break;
      }

      case 'episode_watch_start': {
        await updateDailyStats('episodes_started');
        
        if (uid && data.animeId && data.episodeNumber) {
          await supabaseAdmin.from('watch_sessions').insert({
            user_id: uid,
            anime_id: data.animeId,
            anime_title: data.animeTitle,
            episode_id: data.episodeId,
            episode_number: data.episodeNumber,
            started_at: timestamp,
            status: 'watching',
          });
        }
        break;
      }

      case 'episode_watch_complete': {
        await updateDailyStats('episodes_completed');
        
        if (uid && data.animeId && data.episodeNumber) {
          await supabaseAdmin.from('watch_history').upsert({
            user_id: uid,
            anime_id: data.animeId,
            anime_title: data.animeTitle,
            episode_number: data.episodeNumber,
            created_at: timestamp,
            duration: data.watchDuration || 0,
            completed: true
          }, { onConflict: 'user_id, anime_id, episode_number' });

          await supabaseAdmin.from('watchlist').upsert({
            user_id: uid,
            anime_id: data.animeId,
            progress: data.episodeNumber,
            updated_at: timestamp,
          }, { onConflict: 'user_id, anime_id' });
        }
        break;
      }

      case 'episode_watch_exit': {
        if (uid && data.animeId && data.episodeNumber && data.watchDuration) {
          const watchTimeMinutes = Math.floor(data.watchDuration / 60);
          await updateDailyStats('watch_time', watchTimeMinutes);
        }
        break;
      }

      case 'anime_added': {
        if (uid && data.animeId && data.status) {
          await supabaseAdmin.from('watchlist').upsert({
            user_id: uid,
            anime_id: data.animeId,
            anime_title: data.animeTitle,
            anime_poster: data.poster,
            status: data.status,
            total_episodes: data.totalEpisodes || 0,
            updated_at: timestamp,
          }, { onConflict: 'user_id, anime_id' });
        }
        break;
      }

      case 'status_changed': {
        if (uid && data.animeId && data.status) {
          await supabaseAdmin.from('watchlist').update({
            status: data.status,
            updated_at: timestamp,
          }).eq('user_id', uid).eq('anime_id', data.animeId);
        }
        break;
      }

      case 'favorite_added': {
        if (uid && data.animeId) {
          await supabaseAdmin.from('favorites').upsert({
            user_id: uid,
            anime_id: data.animeId,
            anime_title: data.animeTitle,
            anime_poster: data.poster,
            created_at: timestamp,
          }, { onConflict: 'user_id, anime_id' });
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
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

async function updateDailyStats(field: string, incrementBy: number = 1) {
  if (!supabaseAdmin) return;
  const today = new Date().toISOString().split('T')[0];
  try {
    const { data: existing } = await supabaseAdmin
      .from('daily_stats')
      .select('*')
      .eq('date', today)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from('daily_stats')
        .update({ [field]: (existing[field] || 0) + incrementBy })
        .eq('date', today);
    } else {
      await supabaseAdmin
        .from('daily_stats')
        .insert({ date: today, [field]: incrementBy });
    }
  } catch (error) {
    console.error('Failed to update daily stats:', error);
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Analytics tracking endpoint',
  });
}
