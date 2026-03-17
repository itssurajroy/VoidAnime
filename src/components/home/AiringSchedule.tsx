'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Bell, CheckCircle2, ChevronRight } from 'lucide-react';
import { slugify } from '@/lib/utils/slugify';
import { useInterval } from '@/hooks/useInterval';
import { useHasMounted } from '@/hooks/useHasMounted';

interface AiringScheduleProps {
  schedule: any[];
}

export function AiringSchedule({ schedule = [] }: AiringScheduleProps) {
  const [now, setNow] = useState<number | null>(null);
  const hasMounted = useHasMounted();

  useEffect(() => {
    setNow(Date.now() / 1000);
  }, []);

  useInterval(() => {
    setNow(Date.now() / 1000);
  }, 1000);

  const formatCountdown = (airingAt: number): string => {
    if (!now) return "Calculating...";
    const diff = airingAt - now;
    if (diff <= 0) return "Airing Now";
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    return `${h}h ${m}m away`;
  };

  // Group by status
  const airingNow = now ? schedule.filter(s => s.airingAt <= now && now - s.airingAt < 3600) : [];
  const airingSoon = now ? schedule.filter(s => s.airingAt > now) : [];
  const alreadyAired = now ? schedule.filter(s => now - s.airingAt >= 3600).reverse() : [];

  if (!schedule.length) return null;

  return (
    <section className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-heading font-black text-white flex items-center gap-3">
            Today's Airings <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
            {hasMounted ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Loading Schedule...'} • All times in local
          </p>
        </div>
        <Link href="/calendar" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-anime-primary hover:text-white transition-colors">
          Full Schedule <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AIRING NOW */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-400 flex items-center gap-2 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Airing Now
          </h3>
          <div className="space-y-3">
            {airingNow.length > 0 ? airingNow.slice(0, 3).map((item) => (
              <AiringCard key={item.id} item={item} status="now" />
            )) : (
              <p className="text-xs text-white/20 italic ml-2">Nothing airing at this moment.</p>
            )}
          </div>
        </div>

        {/* AIRING SOON */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-anime-primary flex items-center gap-2 ml-2">
            <Clock className="w-3 h-3" /> Airing Soon
          </h3>
          <div className="space-y-3">
            {airingSoon.slice(0, 3).map((item) => (
              <AiringCard key={item.id} item={item} status="soon" countdown={formatCountdown(item.airingAt)} />
            ))}
          </div>
        </div>

        {/* ALREADY AIRED */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center gap-2 ml-2">
            <CheckCircle2 className="w-3 h-3" /> Already Aired Today
          </h3>
          <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
            {alreadyAired.slice(0, 3).map((item) => (
              <AiringCard key={item.id} item={item} status="aired" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AiringCard({ item, status, countdown }: { item: any, status: 'now' | 'soon' | 'aired', countdown?: string }) {
  const anime = item.media;
  const title = anime.title.english || anime.title.romaji;
  
  return (
    <div className="group relative flex items-center gap-4 p-3 rounded-2xl bg-[#1A1A1A]/30 border border-[#2A2A2A] hover:bg-[#212121] transition-all">
      <div className="relative w-12 h-16 rounded-xl overflow-hidden shrink-0 border border-[#2A2A2A] shadow-lg">
        <Image src={anime.coverImage.large} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-anime-primary transition-colors">{title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">EP {item.episode}</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
            status === 'now' ? 'text-green-400' : 
            status === 'soon' ? 'text-anime-primary' : 'text-white/20'
          }`}>
            {status === 'now' ? 'Live' : status === 'soon' ? countdown : 'Aired'}
          </span>
        </div>
      </div>
      <button className="p-2.5 rounded-xl bg-[#212121] border border-[#2A2A2A] text-white/20 hover:text-white hover:bg-white/10 transition-all">
        {status === 'soon' ? <Bell className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
