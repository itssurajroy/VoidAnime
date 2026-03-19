export const dynamic = 'force-dynamic';

import { hianime } from '@/services/anime';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { TrendingCarousel } from '@/components/home/TrendingCarousel';
import { AnimeGrid } from '@/components/home/AnimeGrid';
import { Top10List } from '@/components/home/Top10List';
import { GenresWidget } from '@/components/home/GenresWidget';
import { 
  Flame, 
  Sparkles, 
  Tv, 
  Heart, 
  CheckCircle, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Globe,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Star,
  Play,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

function mapSpotlight(item: any, index: number) {
  return {
    id: item.id || '',
    name: item.name || 'Unknown Title',
    jname: item.romaji,
    poster: item.posterImage || item.poster || '/placeholder.svg',
    description: item.synopsis || '',
    rank: parseInt(item.spotlight?.replace(/\D/g, '') || String(index + 1), 10),
    otherInfo: [item.type, item.releaseDate, item.quality].filter(Boolean),
  };
}

function mapAnimeCard(item: any) {
  return {
    id: item.id || '',
    name: item.name || 'Unknown Title',
    jname: item.romaji,
    poster: item.posterImage || item.poster || '/placeholder.svg',
    type: item.type,
    duration: item.duration,
    rating: item.quality,
    episodes: item.episodes,
    otherInfo: [item.type, item.releaseDate, item.quality].filter(Boolean),
  };
}

function mapTop10Card(item: any, index: number) {
  return {
    id: item.id || '',
    name: item.name || 'Unknown Title',
    jname: item.romaji,
    poster: item.posterImage || item.poster || '/placeholder.svg',
    rank: index + 1,
    episodes: item.episodes || {},
  };
}

const FALLBACK_GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Isekai", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Seinen", "Shounen", "Slice of Life", "Sports", "Supernatural", "Thriller"
];

export default async function HomePage() {
  let rawData: any = null;

  try {
    const result = await hianime.home();
    rawData = result?.data || result || {};
  } catch (e) {
    console.error('Home data fetch error:', e);
  }

  if (!rawData || Object.keys(rawData).length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 font-black tracking-[0.3em] uppercase animate-pulse">Loading Content...</p>
      </div>
    );
  }

  const spotlights = (rawData.data || []).map(mapSpotlight);
  const trending = (rawData.trending || []).map((item: any, i: number) => ({ ...mapAnimeCard(item), rank: i + 1 }));
  const topAiring: any[] = (rawData.topAiring || []).map(mapAnimeCard);
  const mostPopular = (rawData.mostPopular || []).map(mapAnimeCard);
  const favourites = (rawData.favourites || []).map(mapAnimeCard);
  const recentlyCompleted = (rawData.recentlyCompleted || []).map(mapAnimeCard);
  const recentlyUpdated = (rawData.recentlyUpdated || []).map(mapAnimeCard);
  const recentlyAdded = (rawData.recentlyAdded || []).map(mapAnimeCard);

  const topAnime = rawData.topAnime || {};
  const top10 = {
    today: (topAnime.daily || []).map(mapTop10Card),
    week: (topAnime.weekly || []).map(mapTop10Card),
    month: (topAnime.monthly || []).map(mapTop10Card),
  };

  const genres = rawData.genres || FALLBACK_GENRES;

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-primary/30 selection:text-white pb-32 overflow-x-hidden relative">
      
      {/* Premium Atmosphere: Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full opacity-50" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full opacity-30" />
      </div>

      <div className="relative z-10">
        {/* 1. Hero Spotlight Carousel */}
        {spotlights.length > 0 && (
          <HeroCarousel spotlights={spotlights} />
        )}

        {/* 2. Global Status Bar (Premium Edition) */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 -mt-12 relative z-30 hidden md:block">
          <div className="bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-8">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute inset-0" />
                  <div className="w-3 h-3 rounded-full bg-green-500 relative shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Server Status</span>
                  <span className="block text-[13px] font-black text-white tracking-tight uppercase">Ultra-Low Latency</span>
                </div>
              </div>
              
              <div className="h-10 w-px bg-white/10" />

              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Real-time Engagement</span>
                  <span className="block text-[13px] font-black text-white tracking-tight uppercase tabular-nums">2,481,092 Live Fans</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-white/5 relative overflow-hidden shadow-xl">
                    <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 789}`} alt="User" fill />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-primary flex items-center justify-center text-[10px] font-black text-white z-10 shadow-2xl">
                  +24k
                </div>
              </div>
              <Link href="/community" className="text-[11px] font-black text-primary hover:text-white transition-colors uppercase tracking-[0.2em]">
                Join Global Feed
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Trending Section */}
        {trending.length > 0 && (
          <div className="pt-20">
            <TrendingCarousel animes={trending} />
          </div>
        )}

        {/* 4. Main Content Architecture */}
        <div className="max-w-[1700px] mx-auto px-4 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          
          {/* Left Column: Premium Grids (8 Columns) */}
          <div className="lg:col-span-8 space-y-24">
            
            {recentlyUpdated.length > 0 && (
              <AnimeGrid 
                title="Trending Now" 
                icon={<TrendingUp className="w-6 h-6 text-primary" />} 
                animes={recentlyUpdated.slice(0, 14)} 
              />
            )}

            {/* Premium Community Teaser */}
            <section className="relative w-full rounded-[3rem] overflow-hidden bg-gradient-to-br from-primary/15 via-[#0a0a0a] to-[#050505] border border-white/5 p-10 md:p-16 group">
              <div className="absolute top-0 right-0 p-16 opacity-5 transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-12">
                 <MessageSquare className="w-64 h-64 text-primary" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <Star className="w-3 h-3 fill-primary" /> Multi-Platform Experience
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
                  The Void <span className="text-primary">Library</span>
                </h2>
                <p className="text-white/50 text-lg font-medium leading-relaxed mb-10">
                  Experience anime like never before. Watch together with friends, earn rewards for every episode, and build your ultimate collection in the community.
                </p>
                <div className="flex flex-wrap gap-5">
                  <Link href="/community">
                    <button className="bg-white text-black px-10 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                      Explore Community <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <button className="bg-white/5 backdrop-blur-md text-white px-10 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10">
                    Join our Discord
                  </button>
                </div>
              </div>
            </section>

            {mostPopular.length > 0 && (
              <AnimeGrid 
                title="Recently Updated" 
                icon={<Sparkles className="w-6 h-6 text-primary" />} 
                animes={mostPopular.slice(0, 14)} 
              />
            )}

            {favourites.length > 0 && (
              <AnimeGrid 
                title="All Time Favorites" 
                icon={<Heart className="w-6 h-6 text-primary" />} 
                animes={favourites.slice(0, 14)} 
              />
            )}

            {recentlyCompleted.length > 0 && (
              <AnimeGrid 
                title="Completed Classics" 
                icon={<CheckCircle className="w-6 h-6 text-primary" />} 
                animes={recentlyCompleted.slice(0, 14)} 
              />
            )}
          </div>

          {/* Right Sidebar: Premium Site Insights (4 Columns) */}
          <aside className="lg:col-span-4 space-y-12">
            
            {/* Redesigned Sidebar Header */}
            <div className="relative group overflow-hidden bg-gradient-to-r from-primary/20 to-transparent p-[1px] rounded-[2rem]">
              <div className="bg-[#0a0a0a] rounded-[2rem] p-8 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
                    <Activity className="w-6 h-6 text-primary relative" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Insights</span>
                    <span className="block text-sm font-black text-white uppercase tracking-tight">Site Statistics</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    Live
                  </span>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mt-1">Refreshed 2s ago</span>
                </div>
              </div>
            </div>

            {/* Premium Sidebar Sections: Top Airing & Most Popular */}
            <div className="space-y-12 sticky top-24">
              
              {/* Premium Top Airing Mini-List */}
              <section className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Top Airing</h3>
                  </div>
                  <Link href="/top-airing" className="text-[10px] font-black text-white/30 hover:text-primary transition-colors uppercase tracking-[0.2em]">View Rank</Link>
                </div>
                <div className="p-4 space-y-3">
                  {topAiring.slice(0, 5).map((anime, i) => (
                    <Link key={anime.id} href={`/anime/${anime.id}`} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all">
                      <div className="relative w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-white/5">
                        <Image src={anime.poster} alt={anime.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="56px" />
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-black text-white leading-tight truncate group-hover:text-primary transition-colors uppercase tracking-tight mb-2">
                          {anime.name}
                        </h4>
                        <div className="flex items-center gap-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                          <span className="flex items-center gap-1">
                            <Tv className="w-2.5 h-2.5 text-primary" /> {anime.type || 'TV'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-primary" /> {anime.episodes?.sub || 0} EPS
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-white/5 group-hover:text-primary/10 transition-colors italic">
                        0{i + 1}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <Top10List data={top10} />
              
              <GenresWidget genres={genres} />

              {/* Advanced Trust Widget */}
              <div className="relative group overflow-hidden rounded-[2.5rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-[#0a0a0a] to-transparent opacity-50 group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative p-10 border border-white/5 space-y-8 bg-[#0a0a0a]/40 backdrop-blur-md">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">Safe & Private</h3>
                    <p className="text-white/40 text-sm font-medium leading-relaxed">
                      VoidAnime implements enhanced security measures to ensure your viewing history remains private and your connection stays protected.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-white/20" />
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Global Fast Streaming</span>
                    </div>
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

    </div>
  );
}
