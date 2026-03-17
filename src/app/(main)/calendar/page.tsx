'use client';

import { useState, useEffect, Suspense } from 'react';
import { getAiringSchedule } from '@/lib/api/anilist';
import { MediaCard } from '@/components/shared/MediaCard';
import { Calendar as CalendarIcon, Clock, Sparkles, Bell, Tv, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

function CalendarClient() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const todayIndex = today.getDay();
  const [selectedDay, setSelectedDay] = useState(days[todayIndex]);
  
  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      const now = new Date();
      const selectedDayIndex = days.indexOf(selectedDay);
      const dayOffset = selectedDayIndex - now.getDay();
      
      const startOfDay = new Date(now);
      startOfDay.setDate(now.getDate() + dayOffset);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);

      const weekStart = Math.floor(startOfDay.getTime() / 1000);
      const weekEnd = Math.floor(endOfDay.getTime() / 1000);

      try {
        const data = await getAiringSchedule(weekStart, weekEnd, 1);
        setSchedules(data?.Page?.airingSchedules || []);
      } catch (error) {
        console.error("Failed to fetch airing schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDay]);

  const handleTrack = (animeId: number) => {
    if (!user) {
      if (confirm("Sign in to track shows and get notifications.")) {
        router.push('/login');
      }
    } else {
      alert(`Tracking for Anime ID: ${animeId} will be implemented soon!`);
    }
  };

  const nowTs = Math.floor(Date.now() / 1000);
  const alreadyAired = schedules.filter(s => s.airingAt < nowTs);
  const upcoming = schedules.filter(s => s.airingAt >= nowTs);

  const dayTabs = [
    ...days.slice(todayIndex),
    ...days.slice(0, todayIndex)
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 sm:pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">
        <div className="mb-8 sm:mb-10 md:mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-zinc-300 font-bold text-sm tracking-widest uppercase mb-4 sm:mb-6 backdrop-blur-xl">
            <Tv className="w-4 h-4 text-anime-secondary" />
            Release Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-black text-white mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-xl">
            Never Miss An <span className="glow-text">Episode</span>.
          </h1>
          
          <div className="flex bg-[#1A1A1A] p-1.5 rounded-2xl border border-[#2A2A2A] overflow-x-auto scrollbar-hide">
            {dayTabs.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                  selectedDay === day 
                  ? 'bg-white text-black font-black shadow-xl' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xs uppercase tracking-widest">{day}</span>
                {day === days[todayIndex] && <span className="w-2 h-2 rounded-full bg-anime-primary animate-pulse" />}
              </button>
            ))}
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-anime-secondary animate-spin" />
            <p className="text-white/20 font-black uppercase tracking-widest text-xs">Fetching Airings...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {upcoming.length > 0 && (
              <section>
                <h2 className="flex items-center gap-4 mb-8 border-b border-[#2A2A2A] pb-4 text-2xl md:text-3xl font-heading font-black tracking-tight text-anime-primary drop-shadow-[0_0_15px_rgba(232,93,4,0.4)]">
                  <Sparkles className="w-6 h-6" /> Upcoming Today
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {upcoming.map(s => <AiringCard key={s.id} schedule={s} onTrack={handleTrack} />)}
                </div>
              </section>
            )}

            {alreadyAired.length > 0 && (
              <section>
                <h2 className="flex items-center gap-4 mb-8 border-b border-[#2A2A2A] pb-4 text-2xl md:text-3xl font-heading font-black tracking-tight text-white/50">
                  <Clock className="w-6 h-6" /> Already Aired Today
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 opacity-70">
                  {alreadyAired.map(s => <AiringCard key={s.id} schedule={s} onTrack={handleTrack} />)}
                </div>
              </section>
            )}

            {schedules.length === 0 && (
              <div className="text-center py-32 border border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                <CalendarIcon className="w-16 h-16 text-white/10 mx-auto mb-6" />
                <h3 className="text-xl font-heading font-black text-white/40 mb-2 uppercase tracking-tight">No Airings Today</h3>
                <p className="text-white/20 text-sm">Check back another day for more episodes.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AiringCard({ schedule, onTrack }: { schedule: any, onTrack: (id: number) => void }) {
  const anime = schedule.media;
  const airingTime = new Date(schedule.airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col gap-3">
      <MediaCard 
        id={anime.id} 
        title={anime.title.english || anime.title.romaji} 
        coverImage={anime.coverImage.large} 
        score={anime.averageScore} 
        color={anime.coverImage.color}
        episodes={anime.episodes}
        format={anime.format}
      />
      <div className="flex items-center justify-between px-1 text-sm font-bold text-zinc-300">
        <div className="flex items-center gap-1.5 text-anime-accent bg-anime-accent/10 px-2 py-1 rounded-md border border-anime-accent/20">
          <Clock className="w-3 h-3" />
          <span>{airingTime}</span>
        </div>
        <button 
          onClick={() => onTrack(anime.id)}
          className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#0D0D0D]" />}>
      <CalendarClient />
    </Suspense>
  )
}
