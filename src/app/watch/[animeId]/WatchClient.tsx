'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    Maximize,
    Minimize,
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    Tv,
    ShieldAlert,
    Star,
    X,
    SkipForward,
    Download,
    Info,
    MessageSquare,
    Share2,
    Play,
    Settings,
    Clock,
    Calendar,
    Award
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/watch/VideoPlayer';
import { CommentsSection } from '@/components/watch/Comments';
import { ShareButton } from '@/components/anime/ShareButton';
import { WatchRoomButton } from '@/components/watch/WatchRoomButton';
import { getEpisodeServers, getStreamSources, type AnimeProvider } from '@/services/anime';
import { normalizeEpisodeId } from '@/lib/utils';
import type { AnimeDetailsData, Episode, EpisodeServersData } from '@/types';
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { createBrowserClient } from '@supabase/ssr';

// Extracted Components
import { StreamingSettings } from '@/components/watch/StreamingSettings';

interface WatchClientProps {
    animeId: string;
    episodeId: string;
    category: string;
    episodes: Episode[];
    animeData: AnimeDetailsData;
    aniListData: any;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export default function WatchClient({
    animeId,
    episodeId,
    category,
    episodes = [],
    animeData,
    aniListData
}: WatchClientProps) {
    const router = useRouter();
    const { user } = useSupabaseAuth();
    const { watchlist, updateStatus, isInWatchlist, addItem } = useWatchlist();
    const { toast } = useToast();
    const supabase = createBrowserClient(supabaseUrl, supabaseKey);

    const inWatchlist = isInWatchlist(animeData.anime.info.id);
    const watchlistItem = watchlist.find(item => item.id === animeData.anime.info.id);

    const watchlistStatuses = [
        { label: 'Watching', value: 'WATCHING', color: 'bg-blue-500' },
        { label: 'Completed', value: 'COMPLETED', color: 'bg-green-500' },
        { label: 'On Hold', value: 'ON_HOLD', color: 'bg-yellow-500' },
        { label: 'Dropped', value: 'DROPPED', color: 'bg-red-500' },
        { label: 'Plan to Watch', value: 'PLAN_TO_WATCH', color: 'bg-purple-500' },
    ];

    const handleWatchlistAction = (status: any) => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to manage your watchlist.",
                variant: "destructive",
            });
            return;
        }

        if (inWatchlist) {
            updateStatus(animeData.anime.info.id, status);
        } else {
            const animeInfo = animeData.anime.info;
            const animeCard = {
                id: animeInfo.id,
                name: animeInfo.name,
                poster: animeInfo.poster,
                type: animeInfo.stats?.type,
                rating: animeInfo.stats?.rating,
                duration: animeInfo.stats?.duration,
                episodes: {
                    sub: animeInfo.stats?.episodes?.sub || 0,
                    dub: animeInfo.stats?.episodes?.dub || 0,
                }
            };
            addItem(animeCard as any, status);
        }
    };

    // --- UI States ---
    const [isTheater, setIsTheater] = useState(false);
    const [lightsOff, setLightsOff] = useState(false);
    const [epSearch, setEpSearch] = useState('');
    const [activeRange, setActiveRange] = useState(0);
    const [mobileEpDrawerOpen, setMobileEpDrawerOpen] = useState(false);
    const [skipState, setSkipState] = useState<"intro" | "outro" | null>(null);
    const [mounted, setMounted] = useState(false);
    const [sidebarTab, setSidebarTab] = useState<'episodes' | 'comments'>('episodes');

    const [preferences, setPreferences] = useState({
        autoPlay: true,
        autoNext: true,
        autoSkip: false
    });

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            setPreferences({
                autoPlay: localStorage.getItem('autoPlay') !== 'false',
                autoNext: localStorage.getItem('autoNext') !== 'false',
                autoSkip: localStorage.getItem('autoSkip') === 'true'
            });
        }
    }, []);

    const togglePreference = (id: keyof typeof preferences) => {
        const newValue = !preferences[id];
        setPreferences(prev => ({ ...prev, [id]: newValue }));
        localStorage.setItem(id, String(newValue));
        toast({
            title: `${id.replace('auto', 'Auto ')} ${newValue ? 'Enabled' : 'Disabled'}`,
            duration: 2000
        });
    };

    // --- Data States ---
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [selectedServer, setSelectedServer] = useState('sub-0-XY12');
    const [selectedProvider] = useState<AnimeProvider>('kaido'); // Kept for internal fallback logic
    const [sourceData, setSourceData] = useState<any>(null);
    const [servers, setServers] = useState<any>(null);
    const [isLoadingSource, setIsLoadingSource] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [resumeTime, setResumeTime] = useState(0);
    const failedServers = useRef<Set<string>>(new Set());
    const abortControllerRef = useRef<AbortController | null>(null);

    // Data Inits
    const anime = animeData?.anime || { info: {} as any, moreInfo: {} as any };
    const normalizedTargetEpId = normalizeEpisodeId(episodeId);
    const currentEpisode = episodes.find(ep => normalizeEpisodeId(ep.episodeId) === normalizedTargetEpId) || episodes[0];
    const currentIndex = episodes.findIndex(ep => normalizeEpisodeId(ep.episodeId) === normalizedTargetEpId);
    const hasNext = currentIndex < episodes.length - 1;
    const hasPrev = currentIndex > 0;

    const recommended = animeData.recommendedAnimes?.slice(0, 10) || [];

    // --- Resume Logic ---
    useEffect(() => {
        if (user && currentEpisode) {
            const history = JSON.parse(localStorage.getItem(`history-${user.id}`) || '{}');
            const saved = history[animeData.anime.info.id];
            if (saved && saved.epId === currentEpisode.episodeId) {
                setResumeTime(saved.time || 0);
            } else {
                setResumeTime(0);
            }
        }
    }, [user, currentEpisode?.episodeId, animeData.anime.info.id]);

    const handleTimeUpdate = useCallback((time: number, duration: number) => {
        if (time > 10) {
            if (user) {
                const history = JSON.parse(localStorage.getItem(`history-${user.id}`) || '{}');
                history[animeData.anime.info.id] = {
                    epId: currentEpisode.episodeId,
                    epNum: currentEpisode.number,
                    time: Math.floor(time),
                    updatedAt: Date.now()
                };
                localStorage.setItem(`history-${user.id}`, JSON.stringify(history));
            }

            const globalHistoryStr = localStorage.getItem('voidanime_local_history');
            const globalHistory = globalHistoryStr ? JSON.parse(globalHistoryStr) : {};

            globalHistory[animeData.anime.info.id] = {
                animeId: animeData.anime.info.id,
                animeName: animeData.anime.info.name,
                animePoster: animeData.anime.info.poster,
                epId: currentEpisode.episodeId,
                epNum: currentEpisode.number,
                category: selectedCategory,
                time: Math.floor(time),
                duration: Math.floor(duration),
                updatedAt: Date.now()
            };

            localStorage.setItem('voidanime_local_history', JSON.stringify(globalHistory));
        }
    }, [user, animeData.anime.info, currentEpisode, selectedCategory]);

    const getNormalizedList = (data: any) => {
        if (Array.isArray(data)) return data;
        if (typeof data === 'string' && data.length > 0) return data.split(',').map((s: string) => s.trim());
        return [];
    };

    const genresList = getNormalizedList(anime.moreInfo?.genres);

    const toggleTheater = () => setIsTheater(!isTheater);
    const toggleLights = () => setLightsOff(!lightsOff);

    const handleCategoryChange = (newCategory: string) => {
        setSelectedCategory(newCategory);
        if (servers) {
            const categoryServers = servers[newCategory as keyof EpisodeServersData] as any[];
            if (categoryServers && categoryServers.length > 0) {
                // Select first server from new category (with generated ID)
                const firstServer = categoryServers[0];
                const serverId = `${newCategory}-${firstServer.serverId || firstServer.serverName || 0}`;
                setSelectedServer(serverId);
            }
        }
        const params = new URLSearchParams(window.location.search);
        params.set('category', newCategory);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleServerChange = (serverId: string, serverName: string) => {
        setSelectedServer(serverId);
    };

    const goToNextEpisode = useCallback(() => {
        if (hasNext) {
            const nextEpisode = episodes[currentIndex + 1];
            router.push(`/watch/${animeId}?ep=${normalizeEpisodeId(nextEpisode.episodeId)}&category=${selectedCategory}`, { scroll: false });
        }
    }, [animeId, currentIndex, episodes, hasNext, router, selectedCategory]);

    const goToPrevEpisode = useCallback(() => {
        if (hasPrev) {
            const prevEpisode = episodes[currentIndex - 1];
            router.push(`/watch/${animeId}?ep=${normalizeEpisodeId(prevEpisode.episodeId)}&category=${selectedCategory}`, { scroll: false });
        }
    }, [animeId, currentIndex, episodes, hasPrev, router, selectedCategory]);

    useEffect(() => {
        let isMounted = true;
        async function fetchServers() {
            try {
                const res: any = await getEpisodeServers(currentEpisode.episodeId);
                const serverData = res?.data?.data || res?.data || res;
                if (serverData && isMounted) {
                    setServers(serverData);
                    // Set initial server with proper ID format
                    if (serverData.sub?.length > 0) {
                        setSelectedCategory('sub');
                        setSelectedServer(`sub-0-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
                    } else if (serverData.dub?.length > 0) {
                        setSelectedCategory('dub');
                        setSelectedServer(`dub-0-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
                    } else if (serverData.raw?.length > 0) {
                        setSelectedCategory('raw');
                        setSelectedServer(`raw-0-${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
                    }
                }
            } catch (err) {
                console.error("[Watch] Failed to fetch servers:", err);
            }
        }
        fetchServers();
        return () => { isMounted = false; };
    }, [currentEpisode.episodeId, selectedProvider]);

    const fetchSources = useCallback(async () => {
        if (!currentEpisode?.episodeId) return;
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setIsLoadingSource(true);
        setIsTransitioning(true);
        setFetchError(null);

        try {
            // Use new unified stream sources with automatic fallback
            console.log(`[Watch] Fetching sources for episode: ${currentEpisode.episodeId}, provider: ${selectedProvider}`);
            
            const res = await getStreamSources(currentEpisode.episodeId, selectedProvider, selectedCategory as any);
            if (signal.aborted) return;

            console.log("[Watch] Stream sources response:", res);

            if (!res || !res.sources?.length) {
                throw new Error("No sources found from any provider");
            }

            // Transform to VideoPlayer format
            const sourceResult = {
                sources: res.sources.map((s: any) => ({
                    url: s.url,
                    isM3U8: s.isM3U8 || s.url?.includes('.m3u8'),
                    quality: s.quality || 'auto'
                })),
                tracks: res.tracks || [],
                subtitles: res.subtitles || [],
                headers: res.headers,
                posterImage: res.posterImage || '',
                intro: res.intro,
                outro: res.outro
            };

            console.log("[Watch] Source result:", sourceResult);

            setSourceData(sourceResult);
            setTimeout(() => setIsTransitioning(false), 500);
        } catch (err: any) {
            if (err.name === 'AbortError') return;
            console.error("[Watch] Failed to fetch sources:", err);
            failedServers.current.add(`${selectedCategory}-${selectedServer}`);

            if (servers && !signal.aborted) {
                const cats = ['sub', 'dub', 'raw'] as const;
                const ordered = [selectedCategory, ...cats.filter(c => c !== selectedCategory)];
                for (const cat of ordered) {
                    const catSrvs = servers[cat as keyof EpisodeServersData] as any[];
                    if (!catSrvs) continue;
                    const next = catSrvs.find(s => !failedServers.current.has(`${cat}-${s.serverName}`));
                    if (next) {
                        if (cat !== selectedCategory) setSelectedCategory(cat);
                        setSelectedServer(next.serverName);
                        return;
                    }
                }
            }
            if (!signal.aborted) {
                setFetchError("All sources failed. Try switching to a different provider.");
                setSourceData(null);
                setIsTransitioning(false);
            }
        } finally {
            if (!signal.aborted) setIsLoadingSource(false);
        }
    }, [currentEpisode?.episodeId, selectedServer, selectedCategory, selectedProvider, servers]);

    useEffect(() => {
        fetchSources();
        return () => { if (abortControllerRef.current) abortControllerRef.current.abort(); };
    }, [fetchSources]);

    const episodeRanges = useMemo(() => {
        if (episodes.length <= 100) return [];
        const ranges = [];
        for (let i = 0; i < episodes.length; i += 100) {
            ranges.push({ label: `${i + 1}-${Math.min(i + 100, episodes.length)}`, start: i, end: i + 100 });
        }
        return ranges;
    }, [episodes]);

    useEffect(() => {
        if (episodes.length > 100 && currentIndex !== -1) setActiveRange(Math.floor(currentIndex / 100));
    }, [episodes.length, currentIndex]);

    const filteredEpisodes = useMemo(() => {
        if (epSearch) return episodes.filter(ep => ep.number.toString().includes(epSearch));
        if (episodes.length > 100) {
            const range = episodeRanges[activeRange];
            return range ? episodes.slice(range.start, range.end) : episodes;
        }
        return episodes;
    }, [episodes, epSearch, activeRange, episodeRanges]);

    return (
        <div className={cn("relative min-h-screen bg-[#050505] transition-colors duration-700 overflow-x-hidden", lightsOff && "z-[200]")}>
            {/* AMBIENT BACKGROUND */}
            {!lightsOff && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-50" />
                    <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
                    <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
                </div>
            )}

            {lightsOff && <div className="fixed inset-0 bg-black/98 z-[150] cursor-pointer" onClick={() => setLightsOff(false)} />}

            <div className={cn("mx-auto transition-all duration-700 relative z-[160]", isTheater ? "w-full max-w-none px-0 py-0" : "container max-w-[1800px] px-4 md:px-8 py-6 md:py-10")}>
                
                <div className={cn("grid gap-8 items-start", isTheater ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12")}>
                    
                    {/* LEFT COLUMN: PLAYER & INFO */}
                    <div className={cn("space-y-8", isTheater ? "w-full" : "lg:col-span-8 xl:col-span-9")}>
                        
                        {/* CINEMATIC PLAYER CONTAINER */}
                        <div className="relative group/player">
                            {/* DYNAMIC PLAYER GLOW */}
                            {!lightsOff && (
                                <motion.div 
                                    animate={{ 
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [1, 1.02, 1],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-[40px] pointer-events-none opacity-0 group-hover/player:opacity-100 transition-opacity duration-1000"
                                />
                            )}
                            
                            <div className={cn(
                                "relative bg-black rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/5 transition-all duration-700",
                                isTheater && "fixed inset-0 z-[300] rounded-none border-0 h-screen w-screen flex flex-col"
                            )}>
                                {isTheater && (
                                    <Button variant="ghost" size="icon" onClick={toggleTheater} className="absolute top-6 right-6 z-[310] w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-primary hover:text-black transition-all">
                                        <Minimize className="w-6 h-6" />
                                    </Button>
                                )}

                                <div className={cn("aspect-video w-full bg-black relative", isTheater ? "flex-1" : "")}>
                                    {/* TRANSITION OVERLAY */}
                                    <AnimatePresence>
                                        {isTransitioning && (
                                            <motion.div 
                                                initial={{ opacity: 0 }} 
                                                animate={{ opacity: 1 }} 
                                                exit={{ opacity: 0 }}
                                                className="absolute inset-0 z-[100] bg-[#050505] flex items-center justify-center"
                                            >
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_30px_rgba(147,51,234,0.3)]" />
                                                    <p className="text-primary font-black uppercase tracking-[0.4em] text-xs animate-pulse italic">Optimizing Experience</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {isLoadingSource ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-[#050505]">
                                            <div className="relative">
                                                <div className="absolute inset-[-40px] bg-primary/20 blur-[80px] rounded-full animate-pulse" />
                                                <div className="w-24 h-24 border-2 border-primary/30 border-t-primary rounded-full animate-spin relative z-10" />
                                                <img src="/logo-icon.png" className="absolute inset-0 m-auto w-10 h-10 animate-pulse z-20" alt="VoidAnime" />
                                            </div>
                                            <div className="text-center space-y-3">
                                                <h3 className="text-white text-lg font-bold uppercase tracking-[0.5em] italic">Establishing Link</h3>
                                                <div className="flex items-center gap-3 justify-center text-[10px] font-black uppercase tracking-widest text-white/30 bg-white/5 px-5 py-2 rounded-full border border-white/5 backdrop-blur-xl">
                                                    <span className="text-primary">{selectedServer.toUpperCase()}</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <span>{selectedCategory.toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : sourceData?.sources ? (
                                        <VideoPlayer
                                            sources={sourceData.sources}
                                            tracks={sourceData.subtitles || sourceData.tracks || []}
                                            poster={sourceData.posterImage || anime.info.poster}
                                            referer={sourceData.headers?.Referer}
                                            intro={sourceData.intro}
                                            outro={sourceData.outro}
                                            episodeTitle={`${anime.info.name} - Episode ${currentEpisode.number}`}
                                            onNext={hasNext ? goToNextEpisode : undefined}
                                            onSkipStateChange={setSkipState}
                                            isTheater={isTheater}
                                            autoPlay={preferences.autoPlay}
                                            autoNext={preferences.autoNext}
                                            autoSkip={preferences.autoSkip}
                                            initialTime={resumeTime}
                                            onTimeUpdate={handleTimeUpdate}
                                            onError={() => {
                                                failedServers.current.add(`${selectedCategory}-${selectedServer}`);
                                                setFetchError("Playback failed on this server. Trying alternative...");
                                                fetchSources();
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-zinc-950 px-8 text-center">
                                            <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center rotate-12 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                                                <ShieldAlert className="w-10 h-10 text-red-500 -rotate-12" />
                                            </div>
                                            <div className="space-y-3">
                                                <h3 className="text-white text-2xl font-black uppercase tracking-tight italic">Stream Interrupted</h3>
                                                <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">{fetchError || "The stream source could not be verified. Please try another server."}</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <Button onClick={() => fetchSources()} className="h-14 px-10 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all">Reconnect</Button>
                                                <Button onClick={() => { failedServers.current.clear(); fetchSources(); }} variant="ghost" className="h-14 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all">Reset Config</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* PLAYER CONTROLS & SETTINGS BAR */}
                                <div className="bg-[#0a0a0a] border-t border-white/5 p-6 md:p-8 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                                            <Button variant="ghost" size="icon" onClick={toggleTheater} className="h-11 w-11 rounded-xl bg-white/5 hover:bg-primary hover:text-black transition-all shadow-lg">
                                                {isTheater ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={toggleLights} className="h-11 w-11 rounded-xl bg-white/5 hover:bg-yellow-400 hover:text-black transition-all shadow-lg">
                                                <Lightbulb className={cn("w-5 h-5", lightsOff && "text-yellow-400 fill-yellow-400")} />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-xl">
                                            <Button disabled={!hasPrev} onClick={goToPrevEpisode} size="icon" variant="ghost" className="h-11 w-11 rounded-xl bg-white/5 hover:bg-primary hover:text-black disabled:opacity-20 transition-all">
                                                <ChevronLeft className="w-6 h-6" />
                                            </Button>
                                            <Button disabled={!hasNext} onClick={goToNextEpisode} size="icon" variant="ghost" className="h-11 w-11 rounded-xl bg-white/5 hover:bg-primary hover:text-black disabled:opacity-20 transition-all">
                                                <ChevronRight className="w-6 h-6" />
                                            </Button>
                                            <AnimatePresence>
                                                {skipState && (
                                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                                        <Button 
                                                            onClick={() => { const container = document.querySelector('[data-video-player]') as any; if (container?._skipSection) container._skipSection(); }}
                                                            className="h-11 px-6 rounded-xl bg-primary text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:scale-105 transition-all gap-2"
                                                        >
                                                            Skip {skipState} <SkipForward className="w-4 h-4" />
                                                        </Button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <WatchRoomButton animeId={animeId} episodeId={episodeId} animeTitle={anime.info.name} animePoster={anime.info.poster} episodeNumber={currentEpisode?.number || 1} variant="ghost" className="h-11 px-6 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary uppercase text-[10px] font-black tracking-widest gap-2 transition-all" />
                                        <Link href={`/download/${encodeURIComponent(animeId)}/${encodeURIComponent(normalizeEpisodeId(currentEpisode.episodeId))}`}>
                                            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/5 transition-all">
                                                <Download className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                        <ShareButton title={anime.info.name} className="h-11 w-11 rounded-xl bg-white/5 border border-white/5 transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INFORMATION BAR */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] backdrop-blur-3xl rounded-[32px] md:rounded-[40px] p-8 md:p-12 border border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                            
                            <div className="relative z-10 space-y-8">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                Episode {currentEpisode.number}
                                            </Badge>
                                            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                {anime.info.stats?.duration || '24m'}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                                <Calendar className="w-3 h-3" />
                                                {anime.moreInfo?.aired || 'N/A'}
                                            </div>
                                        </div>
                                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none italic">
                                            {anime.info.name}
                                        </h1>
                                        <div className="flex flex-wrap gap-2">
                                            {genresList.map((genre: string) => (
                                                <Link key={genre} href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}>
                                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-4 py-2 bg-white/5 rounded-full border border-white/5 hover:border-primary/30 hover:text-primary transition-all cursor-pointer">
                                                        {genre}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden md:block">
                                            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Watchlist Status</p>
                                            <p className={cn("text-xs font-black uppercase tracking-widest", inWatchlist ? "text-primary" : "text-white/60")}>
                                                {inWatchlist ? watchlistItem?.status.replace('_', ' ') : 'Not in list'}
                                            </p>
                                        </div>
                                        <Button 
                                            onClick={() => handleWatchlistAction('WATCHING')}
                                            className={cn(
                                                "h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] gap-2 transition-all",
                                                inWatchlist ? "bg-white/5 text-white border border-white/10 hover:bg-white/10" : "bg-primary text-black hover:scale-105 shadow-lg shadow-primary/20"
                                            )}
                                        >
                                            {inWatchlist ? <Settings className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                                            {inWatchlist ? "Manage" : "Add to List"}
                                        </Button>
                                    </div>
                                </div>

                                <p className="text-white/60 text-sm leading-relaxed max-w-4xl line-clamp-3 md:line-clamp-none font-medium">
                                    {anime.info.description || "No description available."}
                                </p>
                            </div>
                        </motion.div>

                        <StreamingSettings 
                            servers={servers}
                            selectedCategory={selectedCategory}
                            selectedServer={selectedServer}
                            handleCategoryChange={handleCategoryChange}
                            handleServerChange={handleServerChange}
                            failedServers={failedServers}
                            currentEpisodeNumber={currentEpisode.number}
                        />

                    </div>

                    {/* RIGHT COLUMN: GLASS-MORPHIC SIDEBAR */}
                    {!isTheater && (
                        <aside className="lg:col-span-4 xl:col-span-3 space-y-8 h-full">
                            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[32px] md:rounded-[40px] border border-white/5 overflow-hidden flex flex-col h-[800px] sticky top-8 shadow-2xl">
                                
                                {/* SIDEBAR TABS */}
                                <div className="flex p-4 gap-2 border-b border-white/5 bg-white/[0.02]">
                                    <button 
                                        onClick={() => setSidebarTab('episodes')}
                                        className={cn(
                                            "flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                            sidebarTab === 'episodes' ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-white/40 hover:bg-white/5"
                                        )}
                                    >
                                        <Tv className="w-4 h-4" /> Episodes
                                    </button>
                                    <button 
                                        onClick={() => setSidebarTab('comments')}
                                        className={cn(
                                            "flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                            sidebarTab === 'comments' ? "bg-primary text-black shadow-lg shadow-primary/20" : "text-white/40 hover:bg-white/5"
                                        )}
                                    >
                                        <MessageSquare className="w-4 h-4" /> Comments
                                    </button>
                                </div>

                                <div className="flex-1 overflow-hidden relative">
                                    <AnimatePresence mode="wait">
                                        {sidebarTab === 'episodes' ? (
                                            <motion.div 
                                                key="episodes"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="h-full flex flex-col"
                                            >
                                                {/* EPISODE SEARCH & RANGE */}
                                                <div className="p-6 space-y-6 border-b border-white/5">
                                                    <div className="relative group">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Search Episode..." 
                                                            value={epSearch}
                                                            onChange={(e) => setEpSearch(e.target.value)}
                                                            className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-5 pl-12 text-xs font-bold text-white outline-none focus:border-primary/50 transition-all placeholder:text-white/20 italic"
                                                        />
                                                        <Maximize className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                                    </div>

                                                    {episodeRanges.length > 0 && !epSearch && (
                                                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                                            {episodeRanges.map((range, idx) => (
                                                                <button
                                                                    key={range.label}
                                                                    onClick={() => setActiveRange(idx)}
                                                                    className={cn(
                                                                        "whitespace-nowrap px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border",
                                                                        activeRange === idx ? "bg-primary text-black border-primary" : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                                                                    )}
                                                                >
                                                                    {range.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* PREMIUM EPISODE LIST */}
                                                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                                                    {filteredEpisodes.map((ep, i) => {
                                                        const isActive = normalizeEpisodeId(ep.episodeId) === normalizedTargetEpId;
                                                        return (
                                                            <Link 
                                                                key={ep.episodeId}
                                                                href={`/watch/${animeId}?ep=${normalizeEpisodeId(ep.episodeId)}&category=${selectedCategory}`}
                                                                className={cn(
                                                                    "group flex items-center gap-4 p-4 rounded-2xl transition-all relative overflow-hidden border",
                                                                    isActive ? "bg-primary/10 border-primary/40 shadow-xl" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.06] hover:border-white/20"
                                                                )}
                                                            >
                                                                {isActive && (
                                                                    <motion.div 
                                                                        layoutId="active-indicator"
                                                                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_#9333ea] z-10"
                                                                    />
                                                                )}
                                                                
                                                                <div className={cn(
                                                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-sm tabular-nums transition-all",
                                                                    isActive ? "bg-primary text-black" : "bg-white/5 text-white/30 group-hover:text-white group-hover:bg-white/10"
                                                                )}>
                                                                    {ep.number}
                                                                </div>
                                                                
                                                                <div className="flex-1 min-w-0">
                                                                    <span className={cn(
                                                                        "text-xs font-bold truncate block tracking-tight uppercase italic",
                                                                        isActive ? "text-white" : "text-white/50 group-hover:text-white"
                                                                    )}>
                                                                        {ep.title || `Episode ${ep.number}`}
                                                                    </span>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Ultra HD</span>
                                                                        {isActive && <span className="text-[8px] font-black text-primary uppercase tracking-widest animate-pulse">Now Playing</span>}
                                                                    </div>
                                                                </div>

                                                                {isActive && (
                                                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                                                                        <Play className="w-3 h-3 text-black fill-current" />
                                                                    </div>
                                                                )}
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                key="comments"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="h-full overflow-y-auto p-6 custom-scrollbar"
                                            >
                                                <CommentsSection animeId={animeId} animeTitle={anime.info.name} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* SUGGESTED CONTENT MINI LIST */}
                            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[32px] p-8 border border-white/5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Recommended</h3>
                                    <Link href="/search" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</Link>
                                </div>
                                <div className="space-y-4">
                                    {recommended.slice(0, 4).map((rec, i) => (
                                        <Link key={rec.id} href={`/anime/${rec.id}`} className="group flex items-center gap-4 hover:scale-[1.02] transition-transform">
                                            <div className="relative w-16 h-20 shrink-0 rounded-xl overflow-hidden shadow-lg">
                                                <Image src={rec.poster} alt={rec.name} fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-[11px] font-black text-white uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-primary transition-colors italic">{rec.name}</h4>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                                                    <span className="text-[9px] font-bold text-white/40">{rec.rating || '8.5'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <span className="text-[9px] font-bold text-white/40 uppercase">{rec.type}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </div>

            {/* MOBILE NAVIGATION BAR (FLOATING) */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[400]">
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 flex items-center justify-between shadow-2xl">
                    <Button onClick={() => setMobileEpDrawerOpen(true)} className="flex-1 h-14 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[10px] gap-2">
                        <Tv className="w-4 h-4" /> Library
                    </Button>
                    <div className="w-px h-8 bg-white/10 mx-3" />
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleTheater} className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-white">
                            {isTheater ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                        </Button>
                        <ShareButton title={anime.info.name} className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 text-white" />
                    </div>
                </div>
            </div>

            {/* ENHANCED MOBILE DRAWER */}
            <AnimatePresence>
                {mobileEpDrawerOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[450] lg:hidden" 
                            onClick={() => setMobileEpDrawerOpen(false)} 
                        />
                        <motion.div 
                            initial={{ y: "100%" }} 
                            animate={{ y: 0 }} 
                            exit={{ y: "100%" }} 
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[460] lg:hidden bg-[#0a0a0a] border-t border-white/10 rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />
                            <div className="p-8 flex items-center justify-between">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Library</h3>
                                <Button variant="ghost" size="icon" onClick={() => setMobileEpDrawerOpen(false)} className="w-12 h-12 rounded-2xl bg-white/5 text-white/40">
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-3 custom-scrollbar">
                                {filteredEpisodes.map((ep, i) => { 
                                    const isActive = normalizeEpisodeId(ep.episodeId) === normalizedTargetEpId; 
                                    return (
                                        <Link 
                                            key={ep.episodeId}
                                            href={`/watch/${animeId}?ep=${normalizeEpisodeId(ep.episodeId)}&category=${selectedCategory}`} 
                                            onClick={() => setMobileEpDrawerOpen(false)} 
                                            className={cn(
                                                "flex items-center gap-5 p-5 rounded-2xl transition-all relative border overflow-hidden",
                                                isActive ? "bg-primary/15 border-primary/50 shadow-xl" : "bg-white/[0.03] border-white/5"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-lg tabular-nums shadow-lg",
                                                isActive ? "bg-primary text-black" : "bg-white/5 text-white/30"
                                            )}>
                                                {ep.number}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className={cn("text-sm font-black truncate block tracking-tight uppercase italic", isActive ? "text-white" : "text-white/60")}>
                                                    {ep.title || `Episode ${ep.number}`}
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Ultra HD Stream</span>
                                                </div>
                                            </div>
                                            {isActive && (
                                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 animate-pulse">
                                                    <Play className="w-4 h-4 text-black fill-current" />
                                                </div>
                                            )}
                                        </Link>
                                    ); 
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
