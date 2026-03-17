'use client';

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Plus, Check, Star, Share2, ChevronDown, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useToast } from "@/hooks/use-toast";
import { useWatchHistory } from "@/hooks/use-watch-history";
import { useUser } from "@/firebase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeroBannerProps {
  anime: any;
  aniListData: any;
  watchLink: string;
}

export function HeroBanner({ anime, aniListData, watchLink }: HeroBannerProps) {
  const { user } = useUser();
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
      // Map AnimeInfo to AnimeCard for watchlist
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

  // Find latest watched episode from history
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

  // Dynamic title sizing — cap font size for long titles
  const titleClasses = useMemo(() => {
    const len = (anime.info.name || '').length;
    if (len > 50) return 'text-2xl sm:text-3xl lg:text-4xl xl:text-4xl';
    if (len > 30) return 'text-3xl sm:text-4xl lg:text-5xl xl:text-5xl';
    return 'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl';
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
        toast({
          title: "Link Copied!",
          description: "Anime link has been copied to your clipboard.",
        });
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
    <div ref={containerRef} className="relative w-full h-[95vh] flex items-center overflow-hidden">
      {/* ─── CINEMATIC BACKGROUND ─── */}
      <motion.div style={{ y: y1, opacity }} className="absolute inset-0 z-0">
        <Image
          src={aniListData?.bannerImage || anime.info.poster}
          alt={anime.info.name}
          fill
          sizes="100vw"
          className="object-cover scale-110 blur-[1px] saturate-[1.1]"
          priority
        />
        {/* Layered Gradients for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Animated Mesh Glow */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full"
        />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-[1920px] pt-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-end">

          {/* ─── FLOATING POSTER ─── */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative shrink-0 group perspective-1000 hidden md:block"
          >
            <div className="relative w-[280px] lg:w-[380px] aspect-[2/3] rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)] border border-white/10 animate-float">
              <Image
                src={anime.info.poster}
                alt={anime.info.name}
                fill
                sizes="(max-width: 1024px) 280px, 380px"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Internal Badge */}
              <div className="absolute top-6 right-6">
                <div className="px-4 py-1.5 rounded-2xl bg-primary/90 backdrop-blur-xl text-black font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl border border-white/20">
                  {anime.info.stats?.quality || '4K ULTRA'}
                </div>
              </div>
            </div>

            {/* Poster Glow Effect */}
            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000 -z-10 rounded-full" />
          </motion.div>

          {/* ─── CONTENT ─── */}
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Meta Pill */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                  <span className="text-xs font-black text-white italic tracking-tighter">
                    {aniListData?.averageScore ? `${aniListData.averageScore}% Score` : 'Must Watch'}
                  </span>
                </div>
                <div className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  {anime.moreInfo?.status || 'Currently Airing'}
                </span>
              </div>

              {/* Main Title */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  {aniListData?.title?.native && (
                    <p className="text-primary font-black italic tracking-[0.2em] text-sm md:text-base animate-pulse">
                      {aniListData.title.native}
                    </p>
                  )}
                  <h1 className={cn(titleClasses, "font-[1000] text-white uppercase tracking-tighter leading-tight text-shadow-strong font-headline italic max-w-4xl mx-auto lg:mx-0 line-clamp-3 break-words")}>
                    {anime.info.name}
                  </h1>
                </div>
                <p className="text-white/30 text-lg md:text-xl font-black italic tracking-[0.2em] uppercase max-w-3xl">
                  {anime.info.jname}
                </p>
              </div>

              {/* Quick Specs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 py-2">
                {[
                  { label: "Aired", val: anime.moreInfo?.aired?.split(' to ')[0] || 'TBA' },
                  { label: "Format", val: anime.info.stats?.type || 'TV' },
                  { label: "Length", val: anime.info.stats?.duration || '24m' },
                  ...(countdown ? [{ label: "Next EP", val: countdown, highlight: true }] : [])
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col items-center lg:items-start">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{spec.label}</span>
                    <span className={cn(
                      "text-sm font-black uppercase tracking-widest",
                      (spec as any).highlight ? "text-primary animate-pulse" : "text-white/80"
                    )}>{spec.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Link href={continueLink} className="w-full sm:w-auto">
                <Button className="w-full h-16 px-12 rounded-[24px] bg-primary text-black hover:bg-white transition-all duration-500 font-[1000] uppercase tracking-[0.25em] text-sm shadow-[0_20px_50px_rgba(147,51,234,0.4)] group overflow-hidden relative">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  {lastWatched ? <History className="w-5 h-5 mr-3 relative z-10" /> : <Play className="w-5 h-5 mr-3 fill-current relative z-10" />}
                  <span className="relative z-10">
                    {lastWatched ? `Continue: Ep ${lastWatched.episodeNumber}` : 'Start Watching'}
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
                          ? "bg-primary text-black border-primary"
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      )}
                    >
                      {inWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />}
                      <span className="text-xs font-black uppercase tracking-widest">
                        {watchlistItem ? watchlistItem.status.replace(/_/g, ' ') : 'Add to List'}
                      </span>
                      <ChevronDown className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1a1b1e] border-white/10 rounded-2xl p-2 w-56 animate-in fade-in zoom-in-95 duration-200">
                    {watchlistStatuses.map((status) => (
                      <DropdownMenuItem
                        key={status.value}
                        onClick={() => handleWatchlistAction(status.value)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer transition-all mb-1 last:mb-0",
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
                          className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest cursor-pointer text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          Remove from List
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  onClick={handleShare}
                  className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-500"
                >
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

    </div>
  );
}
