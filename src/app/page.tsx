'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    ArrowRight,
    Twitter,
    Facebook,
    Plus,
    Loader2,
    MessageSquare,
    Home,
    Film,
    Tv,
    Star,
    Zap,
    Rss,
    Menu as MenuIcon,
    User,
    ShieldCheck,
    Smartphone,
    Download,
    Globe,
    Activity
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { getHomeData } from '@/services/anime';
import { useCommunity } from '@/hooks/useCommunity';
import { formatDistanceToNow } from 'date-fns';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { cn } from '@/lib/utils';

export default function RootPage() {
    const [mounted, setMounted] = useState(false);
    const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { posts, loading: communityLoading } = useCommunity('all');
    const { user, loading: authLoading } = useSupabaseAuth();

    useEffect(() => {
        setMounted(true);
        async function fetchTrending() {
            try {
                const res: any = await getHomeData();
                setTrendingAnime(res?.data?.trending?.slice(0, 8) || []);
            } catch (err) {
                console.error(err);
            }
        }
        fetchTrending();
    }, []);

    if (!mounted) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
    };

    return (
        <div className="relative min-h-screen bg-[#0B0C10] text-white font-sans selection:bg-primary/30 selection:text-white overflow-x-hidden">
            
            {/* Deep Mesh Gradients & Pulsing Glows */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse-soft" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-900/10 blur-[100px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            </div>

            {/* Top Navigation */}
            <header className="relative w-full py-6 px-6 md:px-12 z-50">
                <nav className="max-w-7xl mx-auto flex items-center justify-between md:justify-center">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="flex md:hidden items-center justify-center w-10 h-10 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 shrink-0 group"
                    >
                        <MenuIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    </button>

                    <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
                        {[
                            { href: "/home", label: "Home", icon: Home },
                            { href: "/movies", label: "Movies", icon: Film },
                            { href: "/tv", label: "TV Series", icon: Tv },
                            { href: "/category/most-popular", label: "Most Popular", icon: Star },
                            { href: "/top-airing", label: "Top Airing", icon: Zap },
                            { href: "/news", label: "News", icon: Rss },
                        ].map((item) => (
                            <Link key={item.href} href={item.href} className="hover:text-primary transition-colors flex items-center gap-2 group">
                                <item.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            </header>

            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

            <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 md:px-6">

                {/* ===== HERO SECTION ===== */}
                <motion.section 
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mt-8 relative w-full min-h-[520px] rounded-[40px] overflow-hidden bg-card/30 backdrop-blur-xl border border-white/5 flex flex-col md:flex-row group"
                >
                    {/* Floating Hero Image with Perspective */}
                    <motion.div 
                        initial={{ opacity: 0, x: 100, rotateY: -20 }}
                        animate={{ opacity: 0.8, x: 0, rotateY: -10 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden md:block absolute right-[-5%] top-0 bottom-0 w-[60%] h-full z-10 perspective-1000"
                    >
                        <motion.div 
                            animate={{ 
                                y: [0, -20, 0],
                                rotateZ: [0, 1, 0]
                            }}
                            transition={{ 
                                duration: 6, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src="/jjk-hero.png"
                                alt="VoidAnime Hero"
                                fill
                                className="object-cover object-center"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/60 to-transparent" />
                        </motion.div>
                    </motion.div>

                    {/* Left Content */}
                    <div className="flex-1 z-20 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-16 md:py-0 space-y-10">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">Premium Streaming</span>
                                <div className="flex -space-x-2">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0B0C10] bg-zinc-800 flex items-center justify-center">
                                            <User className="w-3 h-3 text-white/50" />
                                        </div>
                                    ))}
                                    <div className="w-6 h-6 rounded-full border-2 border-[#0B0C10] bg-primary flex items-center justify-center text-[8px] font-bold">
                                        +50k
                                    </div>
                                </div>
                            </div>
                            <h1 className="flex flex-col text-5xl sm:text-7xl font-black tracking-tighter leading-none">
                                <span className="text-white text-headline">VOID</span>
                                <span className="text-primary text-headline flex items-center">
                                    ANIME
                                    <span className="inline-block w-3 h-3 rounded-full bg-primary animate-pulse ml-4" />
                                </span>
                            </h1>
                        </motion.div>

                        {/* Search Section */}
                        <motion.div variants={itemVariants} className="w-full max-w-xl">
                            <form className="relative group/search" action="/search">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-2xl blur opacity-0 group-focus-within/search:opacity-100 transition duration-500" />
                                <div className="relative flex items-center w-full glass-morphism rounded-2xl overflow-hidden border-white/10 group-focus-within/search:border-primary/50 transition-all duration-300">
                                    <input
                                        type="text"
                                        name="q"
                                        placeholder="Discover your next obsession..."
                                        autoComplete="off"
                                        className="w-full h-16 pl-6 pr-16 bg-transparent text-white text-lg placeholder:text-white/30 outline-none font-medium"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 bottom-2 w-12 flex items-center justify-center bg-primary text-white rounded-xl hover:scale-105 transition-transform"
                                    >
                                        <Search className="w-6 h-6" />
                                    </button>
                                </div>
                            </form>

                            {/* Top Searches */}
                            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[11px] px-2">
                                <span className="text-white/30 font-bold uppercase tracking-widest">Trending:</span>
                                {trendingAnime.length > 0 ? trendingAnime.map((anime, i) => (
                                    <Link key={anime.id} href={`/search?q=${encodeURIComponent(anime.name)}`} className="text-white/60 hover:text-primary transition-colors font-medium">
                                        {anime.name}
                                    </Link>
                                )) : (
                                    <div className="flex gap-2">
                                        {[1,2,3].map(i => <div key={i} className="w-16 h-3 bg-white/5 rounded animate-pulse" />)}
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            <Link href={user ? "/home" : "/welcome"}>
                                <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95 group shadow-[0_10px_30px_rgba(147,51,234,0.3)]">
                                    {user ? "Go to Dashboard" : "Start Watching"}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            {!user && (
                                <Link href="/home">
                                    <Button variant="ghost" className="h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs border border-white/5">
                                        Browse Library
                                    </Button>
                                </Link>
                            )}
                        </motion.div>
                    </div>
                </motion.section>

                {/* ===== SHARE BAR ===== */}
                <motion.section 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 py-8 px-10 rounded-[32px] glass-morphism border-white/5"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="block text-lg font-black text-white leading-tight">Spread the Void</span>
                            <span className="text-[12px] text-white/40 font-bold uppercase tracking-[0.2em]">Help us grow the community</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-[#1d9bf0] hover:bg-[#1a8cd8] hover:scale-105 transition-all px-6 py-3 rounded-xl cursor-pointer text-xs font-black uppercase tracking-widest">
                            <Twitter className="w-4 h-4 fill-current" />
                            <span>Post</span>
                        </div>
                        <div className="flex items-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] hover:scale-105 transition-all px-6 py-3 rounded-xl cursor-pointer text-xs font-black uppercase tracking-widest">
                            <Facebook className="w-4 h-4 fill-current" />
                            <span>Share</span>
                        </div>
                    </div>
                </motion.section>

                {/* ===== CONTENT GRID ===== */}
                <section className="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">

                    {/* Left Column: Premium Info Sections */}
                    <div className="lg:col-span-8 space-y-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                                <Globe className="w-3 h-3" />
                                Your Ultimate Library
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic text-headline leading-[0.9] tracking-tighter max-w-2xl">
                                VOIDANIME.ONLINE — THE GOLD STANDARD FOR FREE STREAMING
                            </h2>
                            <p className="text-white/40 text-lg leading-relaxed font-medium">
                                Experience anime like never before. With a library of over 10,000 titles in Ultra-HD, 
                                VoidAnime is built for speed, quality, and complete immersion.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    title: "Is it Safe?",
                                    icon: ShieldCheck,
                                    text: "Your security is our priority. We scan all content 24/7 and maintain a strictly minimal, audited ad profile.",
                                    tag: "Secure"
                                },
                                {
                                    title: "Extreme Speed",
                                    icon: Zap,
                                    text: "Powered by high-performance edge servers for instant loading and zero buffering, even at 4K resolution.",
                                    tag: "Fast"
                                },
                                {
                                    title: "Offline Mode",
                                    icon: Download,
                                    text: "Download any episode directly to your device and watch wherever you go, without an active connection.",
                                    tag: "Mobile"
                                },
                                {
                                    title: "Multi-Device",
                                    icon: Smartphone,
                                    text: "Fully optimized for desktop, tablet, and mobile. Install our PWA for a seamless native experience.",
                                    tag: "Hybrid"
                                }
                            ].map((info, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card p-8 group hover:border-primary/20 transition-all duration-500"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <info.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-primary transition-colors">{info.tag}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight">{info.title}</h3>
                                    <p className="text-sm text-white/40 leading-relaxed font-medium">
                                        {info.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Premium Community Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-white italic text-headline uppercase tracking-tight">Social</h2>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Live</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {communityLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4 glass-card border-dashed">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                    <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">Updating Feed...</span>
                                </div>
                            ) : posts.length > 0 ? (
                                <AnimatePresence mode="popLayout">
                                    {posts.slice(0, 5).map((post, idx) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <Link href={`/community?post=${post.id}`} className="block p-6 glass-card group hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                                                <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-[0.15em]">
                                                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded-md">#{post.category}</span>
                                                    <span className="text-white/10">•</span>
                                                    <span className="text-white/30">{post.createdAt ? formatDistanceToNow(post.createdAt?.toDate?.() || new Date(), { addSuffix: true }) : 'Just now'}</span>
                                                </div>
                                                <h3 className="text-[15px] font-black text-white group-hover:text-primary transition-colors line-clamp-1 mb-2 uppercase tracking-tight leading-tight">
                                                    {post.title}
                                                </h3>
                                                <p className="text-[12px] text-white/40 line-clamp-2 mb-5 leading-relaxed font-medium">
                                                    {post.content}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/10 bg-zinc-900 group-hover:border-primary/50 transition-colors">
                                                            {post.userAvatar ? (
                                                                <Image src={post.userAvatar} alt={post.userName} fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <User className="w-4 h-4 text-white/20" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] font-black text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">{post.userName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-white/20 bg-white/5 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                        <span>{post.commentsCount || 0}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <div className="p-12 text-center glass-card border-dashed italic text-white/20 text-xs">
                                    No discussions found yet.
                                </div>
                            )}
                        </div>

                        <Link href="/community" className="block w-full">
                            <Button className="w-full h-14 rounded-2xl bg-white/5 hover:bg-primary transition-all duration-500 text-white font-black uppercase tracking-[0.2em] text-[10px] border border-white/5 group overflow-hidden relative">
                                <span className="relative z-10 group-hover:scale-110 transition-transform flex items-center justify-center gap-2">
                                    Join Community
                                    <Plus className="w-4 h-4" />
                                </span>
                            </Button>
                        </Link>
                    </aside>
                </section>
            </main>

            {/* Background Decorations */}
            <div className="absolute top-[800px] left-[-200px] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[1500px] right-[-300px] w-[800px] h-[800px] bg-purple-900/5 blur-[150px] rounded-full pointer-events-none" />
        </div>
    );
}
