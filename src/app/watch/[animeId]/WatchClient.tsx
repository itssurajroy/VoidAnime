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
    Clock,
    Flame,
    Badge
} from 'lucide-react';
import { Badge as UiBadge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/watch/VideoPlayer';
import { CommentsSection } from '@/components/watch/Comments';
import { ShareButton } from '@/components/anime/ShareButton';
import { WatchRoomButton } from '@/components/watch/WatchRoomButton';
import { getEpisodeServers, getEpisodeSources } from '@/services/anime';
import { normalizeEpisodeId } from '@/lib/utils';
import type { AnimeDetailsData, Episode, EpisodeServersData } from '@/types';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/firebase";

// Extracted Components
import { EpisodeListUI } from '@/components/watch/EpisodeListUI';
import { StreamingSettings } from '@/components/watch/StreamingSettings';
import { AnimeInfoPanel } from '@/components/watch/AnimeInfoPanel';

interface WatchClientProps {
    animeId: string;
    episodeId: string;
    category: string;
    episodes: Episode[];
    animeData: AnimeDetailsData;
    aniListData: any;
}

export default function WatchClient({
    animeId,
    episodeId,
    category,
    episodes = [],
    animeData,
    aniListData
}: WatchClientProps) {
    const router = useRouter();
    const { user } = useUser();
    const { watchlist, updateStatus, isInWatchlist, addItem } = useWatchlist();
    const { toast } = useToast();

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
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);

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
    const [selectedServer, setSelectedServer] = useState('hd-2');
    const [sourceData, setSourceData] = useState<any>(null);
    const [servers, setServers] = useState<EpisodeServersData | null>(null);
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
            const history = JSON.parse(localStorage.getItem(`history-${user.uid}`) || '{}');
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
                const history = JSON.parse(localStorage.getItem(`history-${user.uid}`) || '{}');
                history[animeData.anime.info.id] = {
                    epId: currentEpisode.episodeId,
                    epNum: currentEpisode.number,
                    time: Math.floor(time),
                    updatedAt: Date.now()
                };
                localStorage.setItem(`history-${user.uid}`, JSON.stringify(history));
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
                setSelectedServer(categoryServers[0].serverName);
            }
        }
        const params = new URLSearchParams(window.location.search);
        params.set('category', newCategory);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleServerChange = (serverName: string, categoryName: string) => {
        setSelectedServer(serverName);
        if (categoryName !== selectedCategory) handleCategoryChange(categoryName);
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
                const res = await getEpisodeServers(currentEpisode.episodeId);
                if (res.data && isMounted) {
                    setServers(res.data);
                    const allServers = [...(res.data.sub || []), ...(res.data.dub || []), ...(res.data.raw || [])];
                    if (allServers.length > 0 && !allServers.find(s => s.serverName === selectedServer)) {
                        setSelectedServer(allServers[0].serverName);
                        if (res.data.sub?.find((s: any) => s.serverName === allServers[0].serverName)) setSelectedCategory('sub');
                        else if (res.data.dub?.find((s: any) => s.serverName === allServers[0].serverName)) setSelectedCategory('dub');
                        else if (res.data.raw?.find((s: any) => s.serverName === allServers[0].serverName)) setSelectedCategory('raw');
                    }
                }
            } catch (err) {
                console.error("[Watch] Failed to fetch servers:", err);
            }
        }
        fetchServers();
        return () => { isMounted = false; };
    }, [currentEpisode.episodeId]);

    const fetchSources = useCallback(async () => {
        if (!currentEpisode?.episodeId) return;
        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setIsLoadingSource(true);
        setIsTransitioning(true);
        setFetchError(null);

        try {
            const res = await getEpisodeSources(currentEpisode.episodeId, selectedServer, selectedCategory);
            if (signal.aborted) return;
            if (!res.data || !res.data.sources?.length) throw new Error("No sources found");
            setSourceData(res.data);
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
                setFetchError("All sources failed. This might be a temporary issue with the providers.");
                setSourceData(null);
                setIsTransitioning(false);
            }
        } finally {
            if (!signal.aborted) setIsLoadingSource(false);
        }
    }, [currentEpisode.episodeId, selectedServer, selectedCategory, servers]);

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

    const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY; };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
            if (dx < 0 && hasNext) goToNextEpisode();
            if (dx > 0 && hasPrev) goToPrevEpisode();
        }
    };

    return (
        <div className={cn("relative min-h-screen bg-[#0B0C10] transition-colors duration-700 pb-32 overflow-x-hidden", lightsOff && "z-[200]")}>
            {!lightsOff && (
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 opacity-40">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full animate-pulse-soft" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[150px] rounded-full animate-float" />
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] sm:w-[1200px] h-[800px] opacity-[0.08]">
                        <Image src={anime.info.poster} alt="Background" fill className="object-cover blur-[120px] scale-150 rotate-12" />
                    </div>
                </div>
            )}

            {lightsOff && <div className="fixed inset-0 bg-black/98 z-[150] cursor-pointer backdrop-blur-sm" onClick={() => setLightsOff(false)} />}

            <div className={cn("container mx-auto px-4 md:px-6 transition-all duration-500 relative z-[160]", isTheater ? "max-w-none px-0 py-0" : "max-w-[1920px] py-4 md:py-8")}>
                <div className={cn("grid gap-8 items-start", isTheater ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]")}>
                    <div className="flex-1 min-w-0 space-y-10">
                        <div className={cn("bg-black rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl relative border border-white/5 transition-all duration-700", isTheater && "fixed inset-0 z-[300] rounded-none border-0 h-screen w-screen flex flex-col")} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                            {isTheater && (
                                <Button variant="ghost" size="icon" onClick={toggleTheater} className="absolute top-8 right-8 z-[310] w-14 h-14 rounded-[20px] bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all"><Minimize className="w-7 h-7" /></Button>
                            )}
                            <div className={cn("aspect-video w-full bg-black relative", isTheater ? "flex-1 min-h-0" : "")}>
                                <div className={cn("absolute inset-0 z-[100] bg-[#0B0C10] transition-opacity duration-500 pointer-events-none flex items-center justify-center", isTransitioning ? "opacity-100" : "opacity-0")}>
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="w-16 h-16 rounded-full border-t-2 border-primary animate-spin" />
                                        <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.4em] italic">Initializing Stream</p>
                                    </div>
                                </div>

                                {isLoadingSource ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-[#0B0C10]/90 backdrop-blur-3xl">
                                        <div className="relative group">
                                            <div className="absolute inset-[-20px] bg-primary/20 blur-3xl rounded-full animate-pulse" />
                                            <div className="w-28 h-28 rounded-full border-t-2 border-primary animate-spin relative z-10" />
                                            <img src="/logo-icon.png" className="absolute inset-0 m-auto w-12 h-12 animate-pulse z-20" alt="Loading" />
                                        </div>
                                        <div className="space-y-3 text-center relative z-10">
                                            <h3 className="text-white text-base font-black uppercase tracking-[0.5em] animate-pulse italic">Connecting</h3>
                                            <div className="flex items-center gap-3 justify-center text-white/20 text-[10px] font-black uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                                <span>{selectedServer.toUpperCase()}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                <span>{selectedCategory.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : sourceData?.sources ? (
                                    <VideoPlayer
                                        sources={sourceData.sources}
                                        tracks={sourceData.tracks || sourceData.subtitles || []}
                                        poster={anime.info.poster}
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
                                            if (servers) {
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
                                            setFetchError("Playback failed on all available servers.");
                                        }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-zinc-950 px-6">
                                        <div className="w-24 h-24 rounded-[32px] bg-red-500/10 border border-red-500/20 flex items-center justify-center rotate-12"><ShieldAlert className="w-12 h-12 text-red-500/40 -rotate-12" /></div>
                                        <div className="text-center space-y-3">
                                            <h3 className="text-white font-black uppercase tracking-tighter text-2xl italic">System Error</h3>
                                            <p className="text-white/30 text-sm font-medium max-w-[320px] mx-auto leading-relaxed">{fetchError || "Provider link expired or blocked."}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <Button onClick={() => fetchSources()} className="h-14 px-10 rounded-2xl bg-primary text-black font-[1000] uppercase tracking-widest text-[11px] hover:bg-white shadow-xl shadow-primary/20">Retry</Button>
                                            <Button onClick={() => { failedServers.current.clear(); setSelectedServer('hd-2'); }} className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-[1000] uppercase tracking-widest text-[11px] hover:bg-white/10">Reset</Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={cn("bg-[#12131a]/95 backdrop-blur-3xl border-t border-white/5 p-4 sm:p-6 md:p-8 space-y-6", isTheater ? "max-h-[30vh] overflow-y-auto" : "")}>
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                                        <Button onClick={() => setMobileEpDrawerOpen(true)} className="lg:hidden h-10 px-4 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white"><Tv className="w-3.5 h-3.5 mr-2" />Episodes</Button>
                                        <Button variant="ghost" size="icon" onClick={toggleTheater} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-primary hover:text-black transition-all shrink-0">{isTheater ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}</Button>
                                        <Button variant="ghost" size="icon" onClick={toggleLights} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 transition-all shrink-0"><Lightbulb className={cn("w-4 h-4", lightsOff && "text-yellow-400 fill-yellow-400")} /></Button>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                                        <Button disabled={!hasPrev} onClick={goToPrevEpisode} size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-primary hover:text-black disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></Button>
                                        <Button disabled={!hasNext} onClick={goToNextEpisode} size="icon" variant="ghost" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-primary hover:text-black disabled:opacity-30"><ChevronRight className="w-5 h-5" /></Button>
                                        {skipState && <Button onClick={() => { const container = document.querySelector('[data-video-player]') as any; if (container?._skipSection) container._skipSection(); }} className="h-10 px-5 rounded-xl bg-primary text-black text-[10px] font-[1000] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-white gap-2">Skip {skipState}<SkipForward className="w-3.5 h-3.5 fill-current" /></Button>}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                                        <WatchRoomButton animeId={animeId} episodeId={episodeId} animeTitle={anime.info.name} animePoster={anime.info.poster} episodeNumber={currentEpisode?.number || 1} variant="ghost" className="h-10 px-5 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary uppercase text-[9px] font-black tracking-widest gap-2" />
                                        <Link href={`/download/${encodeURIComponent(animeId)}/${encodeURIComponent(normalizeEpisodeId(currentEpisode.episodeId))}`}><Button variant="ghost" className="h-10 w-10 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary border border-white/5"><Download className="w-4 h-4" /></Button></Link>
                                        <ShareButton title={anime.info.name} className="h-10 w-10 rounded-xl bg-white/5 border border-white/5" />
                                        <Link href="/contact"><Button variant="ghost" className="h-10 w-10 rounded-xl bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/10"><ShieldAlert className="w-4 h-4" /></Button></Link>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/5">
                                    {[{ id: 'autoPlay', label: 'Auto Play' }, { id: 'autoNext', label: 'Auto Next' }, { id: 'autoSkip', label: 'Auto Skip' }].map((pref) => {
                                        const isActive = mounted && preferences[pref.id as keyof typeof preferences];
                                        return (
                                            <button key={pref.id} onClick={() => togglePreference(pref.id as keyof typeof preferences)} className={cn("flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 group", isActive ? "bg-primary/10 border-primary/30" : "bg-white/[0.02] border-white/5 hover:border-white/10")}>
                                                <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", isActive ? "text-primary" : "text-white/30 group-hover:text-white/50")}>{pref.label}</span>
                                                <div className={cn("w-7 h-3.5 rounded-full relative transition-colors duration-500 border flex items-center", isActive ? "bg-primary border-primary" : "bg-white/5 border-white/10")}><motion.div animate={{ x: isActive ? 14 : 2 }} className={cn("w-2 h-2 rounded-full", isActive ? "bg-black" : "bg-white/20")} /></div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* SERVER SELECTION */}
                        <StreamingSettings 
                            servers={servers}
                            selectedCategory={selectedCategory}
                            selectedServer={selectedServer}
                            handleCategoryChange={handleCategoryChange}
                            handleServerChange={handleServerChange}
                            failedServers={failedServers}
                            currentEpisodeNumber={currentEpisode.number}
                        />

                        {/* MOBILE EPISODE LIST */}
                        {!isTheater && <EpisodeListUI
                            episodes={episodes}
                            epSearch={epSearch}
                            setEpSearch={setEpSearch}
                            episodeRanges={episodeRanges}
                            activeRange={activeRange}
                            setActiveRange={setActiveRange}
                            filteredEpisodes={filteredEpisodes}
                            normalizedTargetEpId={normalizedTargetEpId}
                            animeId={animeId}
                            selectedCategory={selectedCategory}
                            isMobile={true}
                            className="lg:hidden"
                        />}

                        {/* ANIME INFO PANEL */}
                        <AnimeInfoPanel 
                            animeId={animeId}
                            anime={anime}
                            genresList={genresList}
                            inWatchlist={inWatchlist}
                            watchlistItem={watchlistItem}
                            watchlistStatuses={watchlistStatuses}
                            handleWatchlistAction={handleWatchlistAction}
                        />

                        <CommentsSection animeId={animeId} animeTitle={anime.info.name} />
                    </div>

                    {!isTheater && (
                        <aside className="w-full space-y-10 order-2">
                            {/* DESKTOP EPISODE LIST */}
                            <EpisodeListUI
                                episodes={episodes}
                                epSearch={epSearch}
                                setEpSearch={setEpSearch}
                                episodeRanges={episodeRanges}
                                activeRange={activeRange}
                                setActiveRange={setActiveRange}
                                filteredEpisodes={filteredEpisodes}
                                normalizedTargetEpId={normalizedTargetEpId}
                                animeId={animeId}
                                selectedCategory={selectedCategory}
                                className="hidden lg:flex"
                            />

                            <div className="space-y-8">
                                <div className="flex items-center gap-4 ml-4"><Flame className="w-5 h-5 text-primary animate-pulse" /><h3 className="text-xl font-[1000] text-white uppercase tracking-tighter italic">Suggested <span className="text-primary">Content</span></h3></div>
                                <div className="space-y-4">
                                    {recommended.map((rec, i) => (
                                        <motion.div key={`rec-${rec.id}-${i}`} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                                            <Link href={`/anime/${rec.id}`} className="group block">
                                                <GlassPanel intensity="light" className="p-3 rounded-3xl border-white/5 group-hover:border-primary/30 transition-all duration-500">
                                                    <div className="flex items-center gap-5">
                                                        <div className="relative w-20 h-28 shrink-0 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform"><Image src={rec.poster} alt={rec.name} fill sizes="80px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-2 left-2 flex items-center gap-1"><Star className="w-2.5 h-2.5 text-yellow-500 fill-current" /><span className="text-[8px] font-black text-white italic">8.4</span></div></div>
                                                        <div className="flex-1 min-w-0 space-y-2"><h4 className="text-[13px] font-[900] text-white uppercase tracking-tight leading-tight line-clamp-2 italic group-hover:text-primary">{rec.name}</h4><div className="flex items-center gap-3"><span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{rec.type || 'TV'}</span><span className="w-1 h-1 rounded-full bg-white/10" /><span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{rec.duration || '24m'}</span></div><div className="flex items-center gap-2"><Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded-md">{rec.episodes?.sub || 0} SUB</Badge>{rec.episodes?.dub && <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 text-[8px] font-black px-2 py-0.5 rounded-md">{rec.episodes.dub} DUB</Badge>}</div></div>
                                                    </div>
                                                </GlassPanel>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                                <Link href="/search" className="block px-4"><Button variant="ghost" className="w-full h-14 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-primary hover:text-black transition-all text-[11px] font-[1000] uppercase tracking-[0.3em] italic">Discover More</Button></Link>
                            </div>
                        </aside>
                    )}
                </div>
            </div>

            {/* MOBILE DRAWER POPUP */}
            <AnimatePresence>
                {mobileEpDrawerOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[250] lg:hidden" onClick={() => setMobileEpDrawerOpen(false)} />
                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 z-[260] lg:hidden bg-[#0d0e16] border-t border-white/10 rounded-t-[48px] shadow-2xl pb-safe" style={{ maxHeight: '85vh' }}>
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2 opacity-50" />
                            <div className="flex items-center justify-between px-8 pt-6 pb-6 border-b border-white/[0.06]"><div className="flex items-center gap-4"><div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_#9333ea]" /><h3 className="text-xl font-[1000] text-white uppercase tracking-tighter italic">Select Episode</h3><Badge className="bg-white/5 text-white/30 border-white/10 text-[10px] px-3 py-1 rounded-full">{episodes.length} EPS</Badge></div><button onClick={() => setMobileEpDrawerOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-[20px] bg-white/[0.05] text-white/40 border border-white/5 shadow-xl"><X className="w-6 h-6" /></button></div>
                            <div className="overflow-y-auto p-6 space-y-3 custom-scrollbar bg-black/30" style={{ maxHeight: 'calc(85vh - 120px)' }}>{filteredEpisodes.map((ep) => { const isActive = normalizeEpisodeId(ep.episodeId) === normalizedTargetEpId; return (<Link key={ep.episodeId} href={`/watch/${animeId}?ep=${normalizeEpisodeId(ep.episodeId)}&category=${selectedCategory}`} onClick={() => setMobileEpDrawerOpen(false)} className={cn("flex items-center gap-5 px-6 py-5 rounded-3xl transition-all relative border", isActive ? "bg-primary/10 border-primary/30" : "bg-white/[0.02] border-white/5")}>{isActive && <div className="w-1.5 h-full absolute left-0 bg-primary" />}<div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all font-[1000] text-sm tabular-nums", isActive ? "bg-primary text-black" : "bg-white/5 text-white/20")}>{ep.number}</div><div className="flex-1 min-w-0"><span className={cn("text-[14px] font-[900] truncate block tracking-tight uppercase italic", isActive ? "text-white" : "text-white/50")}>{ep.title || `Episode ${ep.number}`}</span><p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1">Full HD Streaming</p></div>{isActive && <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-xl shadow-primary/30 animate-pulse"><Maximize className="w-4 h-4 text-black fill-current" /></div>}</Link>); })}</div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
