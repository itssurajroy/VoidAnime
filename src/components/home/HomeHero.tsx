'use client';

import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Calendar, Zap, Sparkles, Import, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { slugify } from '@/lib/utils/slugify';

interface HomeHeroProps {
  trendingAnime?: any[];
}

export function HomeHero({ trendingAnime = [] }: HomeHeroProps) {
  const { user, loading } = useAuth();
  
  // Guest state placeholder data
  const heroAnime = trendingAnime[0] || null;
  const bgImage = heroAnime?.bannerImage || heroAnime?.coverImage?.extraLarge || 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415-j7M8CB09ZInS.jpg';
  const title = heroAnime?.title?.english || heroAnime?.title?.romaji || 'Track Every Episode';

  if (loading) return <div className="h-[70vh] w-full bg-[#1A1A1A] animate-pulse" />;

  if (user) {
    // LOGGED IN HERO
    return (
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="flex flex-col gap-8">
            <header className="animate-slide-up">
              <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-2">
                Good evening, <span className="text-anime-primary">{user.displayName?.split(' ')[0] || 'User'}</span> 🌙
              </h1>
              <p className="text-zinc-400 font-medium text-lg uppercase tracking-widest text-[10px] md:text-sm">
                You have 3 episodes to catch up on today
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Quick Action */}
              <div className="lg:col-span-8 group relative overflow-hidden rounded-[40px] border border-[#2A2A2A] bg-[#1A1A1A]/40 backdrop-blur-3xl p-8 md:p-12 shadow-2xl transition-all hover:border-anime-primary/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-anime-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-anime-primary/10 transition-colors" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-heading font-black text-white leading-tight">
                      Ready to resume your <span className="glow-text">Journey?</span>
                    </h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <Link href="/list" className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-anime-primary hover:text-white transition-all shadow-xl">
                        <Play className="w-4 h-4 fill-current" /> Continue Watching
                      </Link>
                      <Link href="/calendar" className="flex items-center gap-2 bg-[#212121] border border-[#2A2A2A] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                        <Calendar className="w-4 h-4" /> Today's Airings
                      </Link>
                    </div>
                  </div>
                  
                  {/* Current Progress Stack (Simplified for Hero) */}
                  <div className="w-full md:w-72 space-y-3">
                    {[
                      { title: 'One Piece', ep: 1122, total: 1130, color: 'bg-blue-500' },
                      { title: 'Jujutsu Kaisen', ep: 8, total: 24, color: 'bg-anime-primary' },
                      { title: 'Solo Leveling', ep: 2, total: 12, color: 'bg-anime-accent' },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A] hover:bg-white/10 transition-all cursor-pointer group/item">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-white/80 group-hover/item:text-white truncate pr-2">{item.title}</span>
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">EP {item.ep}/{item.total}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#212121] rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.ep/item.total)*100}%` }}
                            className={`h-full ${item.color}`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="flex-1 p-8 rounded-[40px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-24 h-24 text-anime-primary" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                   <Zap className="w-4 h-4 text-anime-primary" /> Your Journey
                  </h3>                  <div className="space-y-6 relative z-10">
                    <div>
                      <p className="text-3xl font-black text-white">Day 14</p>
                      <p className="text-[10px] font-bold text-anime-primary uppercase tracking-widest">Watching Streak 🔥</p>
                    </div>
                    <div className="pt-6 border-t border-[#2A2A2A]">
                      <p className="text-3xl font-black text-white">Lv. 47</p>
                      <p className="text-[10px] font-bold text-anime-secondary uppercase tracking-widest">Grand Otaku 🏆</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // GUEST HERO
  return (
    <section className="relative w-full h-[85vh] md:h-[95vh] flex items-center overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage}
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center scale-110 blur-[2px] opacity-60 saturate-150 transition-transform duration-[10s] ease-linear"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent w-full md:w-[70%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent" />
        
        {/* Floating Cards Animation (Visual only) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:flex items-center justify-center perspective-1000 opacity-20">
           <div className="grid grid-cols-2 gap-8 rotate-12 -translate-y-20">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-48 h-72 rounded-3xl bg-[#212121] border border-[#2A2A2A] backdrop-blur-xl animate-float" style={{ animationDelay: `${i*0.5}s` }} />
              ))}
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 relative z-10">
        <div className="max-w-3xl space-y-10 animate-slide-up">
          {/* Stats Ticker */}
          <div className="flex items-center gap-4 bg-[#212121] backdrop-blur-2xl border border-[#2A2A2A] rounded-full px-6 py-2.5 w-fit">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0D0D0D] bg-anime-primary" />
              ))}
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/80">
              142,441 users · 8.2M episodes logged · 34K reviews
            </span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-heading font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
              Track Every <span className="text-anime-primary">Episode.</span><br />
              Discover Every <span className="glow-text text-anime-accent">Gem.</span>
            </h1>
            <p className="text-lg md:text-2xl text-zinc-300 font-medium max-w-xl leading-relaxed">
              The industry-leading tracker for anime and manga. Experience content with community features, social tracking, and a premium cinematic UI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link 
              href="/login"
              className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_70px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:translate-y-0"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1">Already using MAL?</span>
              <button className="flex items-center gap-2 text-white hover:text-anime-primary font-bold text-sm transition-colors group">
                <Import className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Import your list in 30 seconds
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
