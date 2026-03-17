export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Rss, Megaphone, MessageSquare, ChevronRight, Newspaper, ArrowRight, PlayCircle, Star, TrendingUp, Clock, Calendar, User } from 'lucide-react';
import { getHomeData } from '@/services/anime';
import { getNewsAction } from '@/actions/news';
import { formatDistanceToNow } from 'date-fns';
import type { NewsItem, AnimeCard } from '@/types';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/badge';
import { NewsCard } from '@/components/news/NewsCard';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Anime News | VoidAnime',
    description: 'Stay updated with the latest anime news, announcements, and the best anime reviews on VoidAnime.',
};

export default async function NewsPage() {
    let trendingAnimes: AnimeCard[] = [];
    let top10Animes: AnimeCard[] = [];
    let newsItems: NewsItem[] = [];

    try {
        const [homeRes, newsRes] = await Promise.all([
            getHomeData(),
            getNewsAction()
        ]);
        trendingAnimes = homeRes.data?.trendingAnimes || [];
        top10Animes = homeRes.data?.top10Animes?.today || [];
        // Only show published news items
        newsItems = newsRes.filter(item => item.status === 'published' || !item.status);
    } catch (err) {
        console.error('Failed to fetch data for news page', err);
    }

    const displayTop10 = top10Animes.slice(0, 10);
    const displayPopular = trendingAnimes.slice(0, 10);

    return (
        <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
            {/* ─── ANIMATED BACKGROUND MESH ─── */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 relative z-10 pt-32 space-y-20">

                {/* PREMIUM HERO HEADER */}
                <div className="relative w-full overflow-hidden rounded-[48px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-10 md:p-20 group">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -mr-300 -mt-300 pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="space-y-8 max-w-3xl text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5">
                                <Megaphone className="w-5 h-5" />
                                <span className="text-[10px] font-[1000] uppercase tracking-[0.4em]">Latest Updates</span>
                            </div>
                            
                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-8xl font-[1000] text-white uppercase tracking-tighter italic leading-none">
                                    Official <span className="text-primary block mt-2">News</span>
                                </h1>
                                <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed italic tracking-wide">
                                    Stay ahead of the release schedule. Real-time announcements, editorial features, and site updates.
                                </p>
                            </div>
                        </div>

                        <div className="relative shrink-0 hidden lg:block">
                            <div className="w-64 h-64 rounded-[48px] bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-3xl group-hover:scale-105 transition-transform duration-700 backdrop-blur-3xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
                                <Rss className="w-24 h-24 text-primary relative z-10 drop-shadow-[0_0_30px_#9333ea]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">

                    {/* Left Column: News Feed */}
                    <div className="xl:col-span-8 space-y-12">
                        <div className="flex items-center gap-4 ml-2">
                            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_#9333ea]" />
                            <h2 className="text-xl font-[1000] text-white uppercase tracking-widest italic">Articles & Feed</h2>
                        </div>

                        <div className="space-y-10">
                            {newsItems.length > 0 ? (
                                newsItems.map((item, index) => (
                                    <NewsCard key={item.id} item={item} index={index} />
                                ))
                            ) : (
                                <GlassPanel intensity="light" className="p-20 text-center rounded-[48px] border-white/5">
                                    <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center mx-auto mb-8 text-white/10">
                                        <Newspaper className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-[1000] text-white uppercase tracking-tighter italic">No Articles</h3>
                                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] mt-4">No recent updates found in our feed.</p>
                                </GlassPanel>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar Modules */}
                    <aside className="xl:col-span-4 space-y-12">
                        
                        {/* Global Trends Module */}
                        <GlassPanel intensity="heavy" className="rounded-[48px] border-white/5 overflow-hidden shadow-3xl">
                            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                                <div className="flex items-center gap-4">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Trending Now</h3>
                                </div>
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-[1000] uppercase px-2 py-0.5 rounded-md">Live</Badge>
                            </div>

                            <div className="p-4 space-y-2">
                                {displayTop10.map((anime, index) => (
                                    <Link href={`/anime/${anime.id}`} key={anime.id} className="flex gap-5 p-4 rounded-3xl hover:bg-white/5 transition-all group">
                                        <div className={cn(
                                            "w-10 font-[1000] text-2xl flex items-center justify-center border-r-[3px] pr-3 transition-colors italic",
                                            index < 3 ? "text-primary border-primary drop-shadow-[0_0_15px_#9333ea]" : "text-white/10 border-white/10 group-hover:text-white/40"
                                        )}>
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <div className="relative w-14 aspect-[3/4] rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                            <Image src={anime.poster} alt={anime.name} fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <PlayCircle className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                                            <h4 className="text-[13px] font-black text-white truncate group-hover:text-primary transition-colors uppercase tracking-tight italic leading-none">{anime.name}</h4>
                                            <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Streaming Now</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </GlassPanel>

                        {/* Community Hub Module */}
                        <GlassPanel intensity="medium" className="p-10 rounded-[48px] border-white/5 space-y-8 relative overflow-hidden group/intel">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none group-hover/intel:bg-primary/20 transition-all duration-1000" />
                            
                            <div className="flex items-center gap-4 relative z-10">
                                <MessageSquare className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-[1000] text-white uppercase tracking-tighter italic leading-none">Community <span className="text-primary block mt-1">Discussion</span></h3>
                            </div>
                            
                            <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose italic relative z-10">
                                Connect with the community. Share reviews, engage in discussions, and contribute to the library.
                            </p>
                            
                            <Link href="/community" className="block relative z-10">
                                <Button className="w-full h-14 rounded-2xl bg-primary text-black font-[1000] uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-white transition-all">Connect Now</Button>
                            </Link>
                        </GlassPanel>

                    </aside>

                </div>
            </div>
        </div>
    );
}
