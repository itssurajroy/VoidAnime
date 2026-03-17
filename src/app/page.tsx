'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    ArrowRight,
    Share2,
    Twitter,
    Facebook,
    MessageCircle,
    Plus,
    Loader2,
    MessageSquare,
    Home,
    Film,
    Tv,
    Star,
    Zap,
    Rss,
    Menu as MenuIcon
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getHomeData } from '@/services/anime';
import { useCommunity } from '@/hooks/useCommunity';
import { formatDistanceToNow } from 'date-fns';
import { MobileMenu } from '@/components/layout/MobileMenu';

export default function RootPage() {
    const [mounted, setMounted] = useState(false);
    const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { posts, loading: communityLoading } = useCommunity('all');

    useEffect(() => {
        setMounted(true);
        async function fetchTrending() {
            try {
                const res = await getHomeData();
                setTrendingAnime(res.data?.trendingAnimes?.slice(0, 11) || []);
            } catch (err) {
                console.error(err);
            }
        }
        fetchTrending();
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex flex-col min-h-screen bg-[#14141d] text-white font-sans selection:bg-[#8b5cf6]/30 selection:text-white">

            {/* Top Navigation */}
            <header className="w-full py-6 px-6 md:px-12 bg-transparent z-50">
                <nav className="max-w-7xl mx-auto flex items-center justify-between md:justify-center">
                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex md:hidden items-center justify-center w-10 h-10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 shrink-0 group"
                    >
                        <MenuIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    </button>

                    <div className="hidden md:flex items-center gap-8 text-[14px] font-medium text-white/90">
                        <Link href="/home" className="hover:text-[#8b5cf6] transition-colors font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <Home className="w-3 h-3 text-[#8b5cf6]/50" />
                            Home
                        </Link>
                        <Link href="/movies" className="hover:text-[#8b5cf6] transition-colors font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <Film className="w-3 h-3 text-[#8b5cf6]/50" />
                            Movies
                        </Link>
                        <Link href="/tv" className="hover:text-[#8b5cf6] transition-colors font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <Tv className="w-3 h-3 text-[#8b5cf6]/50" />
                            TV Series
                        </Link>
                        <Link href="/category/most-popular" className="hover:text-[#8b5cf6] transition-colors font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <Star className="w-3 h-3 text-[#8b5cf6]/50" />
                            Most Popular
                        </Link>
                        <Link href="/top-airing" className="hover:text-[#8b5cf6] transition-colors font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <Zap className="w-3 h-3 text-[#8b5cf6]/50" />
                            Top Airing
                        </Link>
                        <Link href="/news" className="hover:text-[#8b5cf6] transition-colors font-black uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <Rss className="w-3 h-3 text-[#8b5cf6]/50" />
                            News
                        </Link>
                    </div>

                    {/* Placeholder for symmetry on mobile */}
                    <div className="md:hidden w-10" />
                </nav>
            </header>

            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6">

                {/* ===== HERO SECTION ===== */}
                <section className="mt-8 relative w-full min-h-[480px] h-auto md:h-[480px] py-10 md:py-0 rounded-[32px] overflow-hidden bg-[#20202d] shadow-[0_0_80px_rgba(244,63,94,0.15)] flex flex-col md:flex-row border border-white/5">
                    {/* Left Content */}
                    <div className="flex-1 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-16 space-y-8">
                        {/* Logo Styling */}
                        <div className="flex items-baseline group cursor-pointer transition-transform hover:scale-105 w-fit">
                            <span className="text-white text-4xl sm:text-5xl font-black tracking-tight font-headline">void</span>
                            <span className="text-[#8b5cf6] text-4xl sm:text-5xl font-black ml-1 animate-pulse">!</span>
                            <span className="text-white text-4xl sm:text-5xl font-black font-headline">anime</span>
                        </div>

                        {/* Search Section */}
                        <div className="w-full max-w-lg">
                            <form className="relative flex items-center w-full shadow-2xl" action="/search">
                                <input
                                    type="text"
                                    name="q"
                                    placeholder="Search anime..."
                                    autoComplete="off"
                                    className="w-full h-12 pl-5 pr-14 rounded-md bg-white text-black text-[15px] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 transition-all font-medium"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center bg-[#8b5cf6] rounded-r-md hover:bg-[#7c3aed] transition-colors"
                                >
                                    <Search className="w-5 h-5 text-white" />
                                </button>
                            </form>

                            {/* Top Searches - Real Data */}
                            <div className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-[12px]">
                                <span className="text-white/50 font-medium">Top search:</span>
                                {trendingAnime.length > 0 ? trendingAnime.map((anime, i) => (
                                    <Link key={anime.id} href={`/search?q=${encodeURIComponent(anime.name)}`} className="text-white/80 hover:text-[#8b5cf6] transition-colors">
                                        {anime.name}{i < trendingAnime.length - 1 && ','}
                                    </Link>
                                )) : (
                                    <span className="text-white/20 italic">Loading trends...</span>
                                )}
                            </div>
                        </div>

                        {/* Watch Button */}
                        <Link href="/home">
                            <Button className="rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold px-8 h-12 flex items-center gap-3 transition-all active:scale-95 group border-none shadow-lg shadow-[#8b5cf6]/20">
                                Watch anime
                                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </Button>
                        </Link>
                    </div>

                    {/* Right Imagery */}
                    <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[55%] h-full z-10">
                        <div className="relative w-full h-full">
                            <Image
                                src="/jjk-hero.png"
                                alt="Characters"
                                fill
                                className="object-cover object-center opacity-90"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#20202d] via-[#20202d]/40 to-transparent" />
                        </div>
                    </div>
                </section>

                {/* ===== SHARE BAR ===== */}
                <section className="mt-8 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <span className="text-[14px] font-bold text-white/90">Share VoidAnime</span>
                        <span className="text-[12px] text-white/40 font-medium tracking-tight whitespace-nowrap">to your friends</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-[#1d9bf0] hover:bg-[#1a8cd8] transition-colors px-4 py-1.5 rounded-md cursor-pointer text-[12px] font-bold">
                            <Twitter className="w-3.5 h-3.5 fill-current" />
                            <span>Post</span>
                        </div>
                        <div className="flex items-center gap-1 bg-[#1877F2] hover:bg-[#166fe5] transition-colors px-4 py-1.5 rounded-md cursor-pointer text-[12px] font-bold">
                            <Facebook className="w-3.5 h-3.5 fill-current" />
                            <span>Share</span>
                        </div>
                        <div className="flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 transition-colors w-9 h-8 rounded-full cursor-pointer">
                            <Plus className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </section>

                {/* ===== CONTENT GRID ===== */}
                <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">

                    {/* Left Column: Info Content */}
                    <div className="lg:col-span-8 space-y-12">
                        <div className="space-y-6 text-white/60 text-[14px] leading-7">
                            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">VoidAnime.online - The best site to watch anime online for Free</h1>
                            <p>Do you know that according to Google, the monthly search volume for anime related topics is up to over 1 Billion times? Anime is famous worldwide and it is no wonder we&apos;ve seen a sharp rise in the number of free anime streaming sites.</p>
                            <p>Just like free online movie streaming sites, anime watching sites are not created equally, some are better than the rest, so we&apos;ve decided to build VoidAnime.online to be one of the best free anime streaming site for all anime fans on the world.</p>
                        </div>

                        <div className="space-y-6 text-white/60 text-[14px] leading-7">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">1/ What is VoidAnime.online?</h2>
                            <p>VoidAnime.online is a free site to watch anime and you can even download subbed or dubbed anime in ultra HD quality without any registration or payment. By having only one ads in all kinds, we are trying to make it the safest site for free anime.</p>
                        </div>

                        <div className="space-y-6 text-white/60 text-[14px] leading-7">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">2/ Is VoidAnime.online safe?</h2>
                            <p>Yes we are, we do have only one Ads to cover the server cost and we keep scanning the ads 24/7 to make sure all are clean, if you find any ads that is suspicious, please forward us the info and we will remove it.</p>
                        </div>

                        <div className="space-y-6 text-white/60 text-[14px] leading-7">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">3/ What makes VoidAnime.online the best site to watch anime free?</h2>
                            <p>VoidAnime.online offers a premium-quality streaming experience with fast loading times, minimal advertisements, and a massive library of the latest releases and classic titles. Our platform is built with high-performance technology to ensure seamless playback across all your favorite series.</p>
                        </div>

                        <div className="space-y-6 text-white/60 text-[14px] leading-7">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">4/ Do I need to register to watch anime?</h2>
                            <p>No, you do not need an account to watch your favorite shows. However, creating a free account allows you to maintain a personalized watchlist, track your progress, and join our growing community of anime enthusiasts.</p>
                        </div>

                        <div className="space-y-6 text-white/60 text-[14px] leading-7">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">5/ Can I download anime from VoidAnime.online?</h2>
                            <p>Yes, most of our titles are available for download so you can enjoy them offline. Simply look for the download option on the episode page to save content directly to your device in high definition.</p>
                        </div>

                        <div className="space-y-6 text-white/60 text-[14px] leading-7">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">6/ What devices can I use to watch anime?</h2>
                            <p>VoidAnime.online is fully optimized for all devices. Whether you are using a desktop, laptop, tablet, or smartphone, our responsive design ensures a perfect viewing experience. You can also install our PWA for a native app-like experience on your mobile device.</p>
                        </div>
                    </div>

                    {/* Right Column: Trending Posts - Real Community Data */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Community Trends</h2>
                        </div>

                        <div className="space-y-4">
                            {communityLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white/[0.02] rounded-3xl border border-white/5">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Updating List...</span>
                                </div>
                            ) : posts.length > 0 ? (
                                posts.slice(0, 5).map((post) => (
                                    <Link key={post.id} href={`/community?post=${post.id}`} className="block p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-[0.2em]">
                                            <span className="text-primary">#{post.category}</span>
                                            <span className="text-white/10">•</span>
                                            <span className="text-white/30">{post.createdAt ? formatDistanceToNow(post.createdAt?.toDate?.() || new Date(), { addSuffix: true }) : 'Just now'}</span>
                                            <div className="ml-auto flex items-center gap-1.5 text-white/20">
                                                <MessageSquare className="w-3 h-3" />
                                                <span>{post.commentsCount || 0}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-[14px] font-black text-white group-hover:text-primary transition-colors line-clamp-1 mb-2 uppercase tracking-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-[12px] text-white/40 line-clamp-2 mb-4 leading-relaxed font-medium">
                                            {post.content}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-6 h-6 rounded-lg overflow-hidden border border-white/5">
                                                <Image src={post.userAvatar} alt={post.userName} fill className="object-cover" />
                                            </div>
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{post.userName}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-8 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/5 italic text-white/20 text-xs">
                                    No community discussions found yet.
                                </div>
                            )}
                        </div>

                        <Link href="/community" className="block w-full">
                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest h-12 rounded-xl text-[11px] border-none shadow-xl">
                                Join Community
                            </Button>
                        </Link>
                    </aside>
                </section>
            </main>
        </div>
    );
}
