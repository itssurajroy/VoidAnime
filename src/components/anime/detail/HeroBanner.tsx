'use client';

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Plus, Check, Star, Share2, ChevronDown, History, Tv, Clock, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";
import { useWatchHistory } from "@/hooks/use-watch-history";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import {
  DropdownMenu,  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface HeroBannerProps {
  anime: any;
  aniListData: any;
  watchLink: string;
}

export function HeroBanner({ anime, aniListData, watchLink }: HeroBannerProps) {
  const { user } = useSupabaseAuth();
  const { watchlist, updateStatus, isInWatchlist, addItem, removeFromWatchlist } = useWatchlist();
  const { history } = useWatchHistory();
  const { toast } = useToast();

  const inWatchlist = isInWatchlist(anime.info.id);
  const watchlistItem = watchlist.find(item => item.id === anime.info.id);

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
      updateStatus(anime.info.id, status);
    } else {
      const animeCard = {
        id: anime.info.id,
        name: anime.info.name,
        poster: anime.info.poster,
        type: anime.info.stats?.type,
        rating: anime.info.stats?.rating,
        duration: anime.info.stats?.duration,
        episodes: {
          sub: anime.info.stats?.episodes?.sub || 0,
          dub: anime.info.stats?.episodes?.dub || 0,
        }
      };
      addItem(animeCard as any, status);
    }
  };

  const lastWatched = history.find(h => h.animeId === anime.info.id);
  const continueLink = lastWatched ? `/watch/${lastWatched.episodeId}` : watchLink;

  const [countdown, setCountdown] = useState<string>("");

  const watchlistStatuses = [
    { label: 'Watching', value: 'WATCHING' },
    { label: 'Plan to Watch', value: 'PLAN_TO_WATCH' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'On Hold', value: 'ON_HOLD' },
    { label: 'Dropped', value: 'DROPPED' },
  ];

  useEffect(() => {
    if (!aniListData?.nextAiringEpisode) return;

    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = aniListData.nextAiringEpisode.airingAt - now;

      if (diff <= 0) {
        setCountdown("");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);

      setCountdown(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [aniListData]);

  const titleClasses = useMemo(() => {
    const len = (anime.info.name || '').length;
    if (len > 50) return 'text-2xl sm:text-3xl lg:text-4xl';
    if (len > 30) return 'text-3xl sm:text-4xl lg:text-5xl';
    return 'text-4xl sm:text-5xl lg:text-6xl';
  }, [anime.info.name]);

  const handleShare = async () => {
    const shareData = {
      title: anime.info.name,
      text: anime.info.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied!", description: "Anime link has been copied to your clipboard." });
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[100vh] lg:h-[90vh] flex items-center overflow-hidden pb-12 lg:pb-0">
      {/* ─── PREMIUM BLURRED BACKGROUND ─── */}
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
        {(aniListData?.bannerImage || anime.info.poster) && (
          <Image
            src={aniListData?.bannerImage || anime.info.poster}
            alt={anime.info.name}
            fill
            sizes="100vw"
            className="object-cover scale-110 blur-[8px] saturate-[1.2] opacity-60"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/40 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Dynamic Glows */}
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-primary/20 blur-[180px] rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.05, 0.2, 0.05], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-purple-600/10 blur-[150px] rounded-full"
        />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-[1920px] pt-32 lg:pt-20">
        <GlassPanel intensity="heavy" className="p-6 md:p-12 lg:p-16 rounded-[40px] border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-visible">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start">

            {/* ─── FLOATING POSTER ─── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative shrink-0 group perspective-1000"
            >
              <div className="relative w-[240px] md:w-[280px] lg:w-[340px] aspect-[2/3] rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-white/20 transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(147,51,234,0.4)] group-hover:border-primary/50 group-hover:-translate-y-2">
                {anime.info.poster && (
                  <Image
                    src={anime.info.poster}
                    alt={anime.info.name}
                    fill
                    sizes="(max-width: 1024px) 280px, 340px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* QUALITY BADGE */}
                <div className="absolute top-5 right-5">
                  <div className="px-3 py-1.5 rounded-xl bg-primary backdrop-blur-xl text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl border border-white/20 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 fill-current" />
                    {anime.info.stats?.quality || 'HD'}
                  </div>
                </div>

                {/* EPISODES OVERLAY */}
                <div className="absolute bottom-5 left-5 right-5 flex gap-2">
                  {anime.info.stats?.episodes?.sub > 0 && (
                    <div className="flex-1 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 text-center">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest block">SUB</span>
                       <span className="text-sm font-black text-white">{anime.info.stats.episodes.sub}</span>
                    </div>
                  )}
                  {anime.info.stats?.episodes?.dub > 0 && (
                    <div className="flex-1 py-2 rounded-xl bg-primary/20 backdrop-blur-xl border border-primary/20 text-center">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest block">DUB</span>
                       <span className="text-sm font-black text-white">{anime.info.stats.episodes.dub}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ─── CONTENT AREA ─── */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                {/* META INFO */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-xl">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    <span className="text-xs font-black text-yellow-500 tracking-tighter">
                      {aniListData?.averageScore ? `${aniListData.averageScore}% Score` : (anime.info.stats?.rating || '8.5')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                    <Tv className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-xs font-black text-white/80 uppercase tracking-widest">{anime.info.stats?.type || 'TV'}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                    <Clock className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-xs font-black text-white/80 uppercase tracking-widest">{anime.info.stats?.duration || '24m'}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
                    <Info className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-black text-primary uppercase tracking-widest">{anime.moreInfo?.status || 'Airing'}</span>
                  </div>
                </div>

                {/* TITLES */}
                <div className="space-y-4">
                  <h1 className={cn(titleClasses, "font-[1000] text-white uppercase tracking-tighter leading-tight italic max-w-4xl mx-auto lg:mx-0 text-shadow-strong")}>
                    {anime.info.name}
                  </h1>
                  <p className="text-white/40 text-sm md:text-base font-bold italic tracking-[0.2em] uppercase">
                    {anime.info.jname}
                  </p>
                </div>

                {/* SYNOPSIS (PREVIEW) */}
                <p className="text-white/60 text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-4 max-w-3xl font-medium tracking-wide">
                  {aniListData?.description?.replace(/<[^>]*>?/gm, '') || anime.info.description || "The narrative remains uncharted. Experience the journey firsthand."}
                </p>

                {/* COUNTDOWN IF AVAILABLE */}
                {countdown && (
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/30 animate-pulse">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Next Episode In:</span>
                    <span className="text-sm font-black text-white tracking-widest">{countdown}</span>
                  </div>
                )}
              </motion.div>

              {/* ACTION BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-6 pt-4"
              >
                <Link href={continueLink} className="w-full sm:w-auto">
                  <Button className="w-full h-16 px-12 rounded-[24px] bg-primary text-black hover:bg-white transition-all duration-500 font-[1000] uppercase tracking-[0.25em] text-sm shadow-[0_20px_50px_rgba(147,51,234,0.4)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] group overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    {lastWatched ? <History className="w-5 h-5 mr-3 relative z-10" /> : <Play className="w-5 h-5 mr-3 fill-current relative z-10" />}
                    <span className="relative z-10">
                      {lastWatched ? `Ep ${lastWatched.episodeNumber}` : 'Watch Now'}
                    </span>
                  </Button>
                </Link>

                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={cn(
                          "h-16 px-8 rounded-[24px] border transition-all duration-500 group flex items-center gap-3",
                          inWatchlist
                            ? "bg-white/10 text-white border-primary"
                            : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30"
                        )}
                      >
                        {inWatchlist ? <Check className="w-6 h-6 text-primary" /> : <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                          {watchlistItem ? watchlistItem.status.replace(/_/g, ' ') : 'Watchlist'}
                        </span>
                        <ChevronDown className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#1a1b1e] border-white/10 rounded-2xl p-2 w-56 backdrop-blur-2xl">
                      {watchlistStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status.value}
                          onClick={() => handleWatchlistAction(status.value)}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all mb-1 last:mb-0",
                            watchlistItem?.status === status.value
                              ? "bg-primary text-black"
                              : "text-white/40 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          {status.label}
                          {watchlistItem?.status === status.value && <Check className="w-4 h-4" />}
                        </DropdownMenuItem>
                      ))}
                      {inWatchlist && (
                        <>
                          <DropdownMenuSeparator className="bg-white/5 my-2" />
                          <DropdownMenuItem
                            onClick={() => removeFromWatchlist(anime.info.id)}
                            className="flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            Remove
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    onClick={handleShare}
                    className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-500"
                  >
                    <Share2 className="w-6 h-6" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
