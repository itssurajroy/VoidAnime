'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Zap, BarChart3 } from 'lucide-react';
import { useListStore } from '@/store/listStore';

const AnimePassport = dynamic(
  () => import('@/components/user/AnimePassport').then(mod => mod.AnimePassport),
  { loading: () => <div className="h-96 skeleton rounded-[40px]" /> }
);

const AchievementShowcase = dynamic(
  () => import('@/components/gamification/AchievementShowcase').then(mod => mod.AchievementShowcase),
  { loading: () => <div className="h-48 skeleton rounded-3xl" /> }
);

export default function StatsPage() {
  const { entries } = useListStore();
  const entriesArray = useMemo(() => Object.values(entries), [entries]);

  const completedEntries = useMemo(() => 
    entriesArray.filter(e => e.status === 'COMPLETED'),
    [entriesArray]
  );

  const watchingEntries = useMemo(() => 
    entriesArray.filter(e => e.status === 'WATCHING'),
    [entriesArray]
  );

  const totalEpisodes = useMemo(() => 
    entriesArray.reduce((sum, e) => sum + (e.progress || 0), 0),
    [entriesArray]
  );

  const stamps = useMemo(() => {
    return completedEntries.slice(0, 8).map((entry, i) => {
      const categories = ['Shonen Territory', 'Fantasy Realm', 'Psychological', 'Action Hero', 'Romance Saga', 'Comedy Gold', 'Horror House', 'Slice of Life'];
      const icons = ['flame', 'zap', 'shield', 'star', 'heart', 'music', 'ghost', 'coffee'];
      const colors = ['border-red-500', 'border-yellow-500', 'border-purple-500', 'border-blue-500', 'border-pink-500', 'border-green-500', 'border-orange-500', 'border-cyan-500'];
      
      const completed = entry.timestamps.completed;
      const date = completed 
        ? new Date(completed.seconds * 1000).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'N/A';
      
      return {
        title: entry.title || `Anime ${entry.anilistId}`,
        category: categories[i % categories.length],
        date,
        image: entry.coverImage || '',
        iconName: icons[i % icons.length],
        color: colors[i % colors.length]
      };
    });
  }, [completedEntries]);

  const completionRate = entriesArray.length > 0 
    ? Math.round((completedEntries.length / entriesArray.length) * 100) 
    : 0;

  if (entriesArray.length === 0) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-24 sm:pt-28 pb-20 selection:bg-anime-primary/30">
        <div className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="mb-8 sm:mb-12 md:mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-zinc-300 font-bold text-sm tracking-widest uppercase mb-4 sm:mb-6 backdrop-blur-xl">
              <BarChart3 className="w-4 h-4 text-anime-primary" />
              My Statistics
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-black text-white mb-4 sm:mb-6 leading-tight drop-shadow-xl">
              Your Journey, <span className="glow-text">Visualized</span>.
            </h1>
          </div>

          <div className="text-center py-32 border border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
            <BarChart3 className="w-20 h-20 text-white/10 mx-auto mb-6" />
            <h3 className="text-2xl font-heading font-black text-white/40 mb-2 uppercase tracking-tight">No Data Yet</h3>
            <p className="text-white/20 text-sm max-w-xs mx-auto">Start tracking your anime to see your statistics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 sm:pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        
        <div className="mb-8 sm:mb-12 md:mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-zinc-300 font-bold text-sm tracking-widest uppercase mb-4 sm:mb-6 backdrop-blur-xl">
            <BarChart3 className="w-4 h-4 text-anime-primary" />
            My Statistics
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-black text-white mb-4 sm:mb-6 leading-tight drop-shadow-xl">
            Your Journey, <span className="glow-text">Visualized</span>.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-heading font-black text-white uppercase tracking-widest">Travel Log</h2>
                <button className="text-xs font-bold text-anime-primary hover:text-white transition-colors">Export Passport (PNG)</button>
              </div>
              <AnimePassport username="VoidTraveler" stamps={stamps} />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-heading font-black text-white uppercase tracking-widest mb-6 px-2">Unlocked Badges</h2>
              <AchievementShowcase />
            </section>

            <section className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-anime-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                 <h2 className="text-2xl font-heading font-black text-white flex items-center gap-3">
                   <Zap className="w-6 h-6 text-anime-secondary" /> AI Watch DNA
                 </h2>
                 <div className="px-4 py-2 bg-gradient-to-r from-anime-primary/20 to-anime-secondary/20 rounded-2xl border border-[#2A2A2A] backdrop-blur-xl">
                   <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Compatibility Rating: {completionRate}%</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-6 bg-[#212121] rounded-3xl border border-[#2A2A2A] hover:bg-white/10 transition-colors">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Tracked</p>
                   <p className="text-xl font-black text-white">{entriesArray.length}</p>
                   <p className="text-xs text-white/50 mt-2">{watchingEntries.length} watching</p>
                 </div>
                 <div className="p-6 bg-[#212121] rounded-3xl border border-[#2A2A2A] hover:bg-white/10 transition-colors">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Episodes Watched</p>
                   <p className="text-xl font-black text-white">{totalEpisodes}</p>
                   <p className="text-xs text-white/50 mt-2">~{Math.round(totalEpisodes * 24 / 60)} hours</p>
                 </div>
                 <div className="p-6 bg-[#212121] rounded-3xl border border-[#2A2A2A] hover:bg-white/10 transition-colors">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Completed</p>
                   <p className="text-xl font-black text-white">{completedEntries.length}</p>
                   <p className="text-xs text-white/50 mt-2">{completionRate}% completion</p>
                 </div>
               </div>

               <div className="mt-10 h-32 w-full bg-[#0D0D0D]/50 rounded-3xl border border-[#2A2A2A] flex items-center justify-center p-8 gap-1 overflow-hidden">
                 {[...Array(20)].map((_, i) => {
                   const seed = ((i * 7 + 13) * 17) % 100;
                   const height = 20 + (seed * 0.8);
                   const opacity = 0.3 + ((seed % 70) / 100);
                   return (
                     <div 
                       key={i} 
                       className="w-1 rounded-full animate-pulse"
                       style={{ 
                         height: `${height}%`, 
                         backgroundColor: i % 3 === 0 ? '#9D4EDD' : i % 3 === 1 ? '#5A189A' : '#C77DFF',
                         animationDelay: `${i * 0.1}s`,
                         opacity
                       }} 
                     />
                   );
                 })}
               </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 rounded-[40px] shadow-2xl sticky top-28">
              <h3 className="text-xl font-heading font-black text-white mb-8 uppercase tracking-widest">Vital Signs</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      Completion Rate
                    </span>
                    <span className="text-sm font-black text-anime-primary">{completionRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#212121] rounded-full overflow-hidden">
                    <div className="h-full bg-anime-primary" style={{ width: `${completionRate}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                      Currently Watching
                    </span>
                    <span className="text-sm font-black text-anime-accent">{watchingEntries.length}</span>
                  </div>
                </div>
                <div className="pt-8 border-t border-[#2A2A2A]">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Recent Activity</p>
                  <div className="space-y-3">
                    {watchingEntries.slice(0, 4).map(entry => (
                      <div key={entry.anilistId} className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white/80 truncate max-w-[150px]">{entry.title}</span>
                        <span className="text-[10px] font-mono text-white/20">EP {entry.progress}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
