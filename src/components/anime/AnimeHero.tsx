'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Play,
  Info,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Layers,
  MessageCircle,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SpotlightAnime } from '@/types';

interface AnimeHeroProps {
  animes: SpotlightAnime[];
}

export function AnimeHero({ animes }: AnimeHeroProps) {
  const [currentIndex, setCurrentDate] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentDate((prev) => (prev + 1) % animes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, animes.length]);

  const currentAnime = animes[currentIndex];

  return (
    <div
      className="relative w-full min-h-[60vh] sm:min-h-[65vh] md:h-[750px] lg:h-[800px] overflow-hidden group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 animated-gradient-mesh opacity-80" />
      
      {/* Dynamic Backgrounds */}
      {animes.map((anime, idx) => (
        <div
          key={anime.id}
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-in-out",
            idx === currentIndex ? "opacity-100 scale-100 visible" : "opacity-0 scale-110 invisible"
          )}
        >
          <Image
            src={anime.poster}
            alt={anime.name}
            fill
            sizes="100vw"
            className="object-cover animate-ken-burns"
            priority={idx === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          {/* Cyberpunk overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
        </div>
      ))}

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/10 blur-[180px] rounded-full pointer-events-none" />

      {/* Hero Content */}
      <div className="relative h-full container max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 flex flex-col justify-center pt-20 md:pt-16 overflow-hidden">
        <div className={cn(
          "max-w-3xl space-y-5 md:space-y-8 relative z-30 transition-all duration-700",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>

          {/* Status Badge */}
          <div className="reveal-item reveal-1 flex items-center gap-3">
            <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-purple-400 text-black text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-md shadow-[0_0_30px_rgba(147,51,234,0.6)] animate-pulse-glow">
              #{currentIndex + 1} Trending
            </span>
            <div className="flex items-center gap-2 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
              <Layers className="w-3 h-3 text-primary" />
              <span>{currentAnime.type || 'TV Series'}</span>
            </div>
          </div>

          {/* Title with Cyberpunk Effect */}
          <div className="space-y-2 reveal-item reveal-2">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[84px] font-[900] text-white uppercase tracking-tighter leading-[0.95] font-headline title-shadow drop-shadow-2xl line-clamp-2 relative">
              {currentAnime.name}
              <span className="absolute -inset-1 bg-primary/20 blur-xl rounded-lg -z-10" />
            </h1>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2.5 text-[10px] md:text-[13px] font-black text-white/60 uppercase tracking-widest reveal-item reveal-3">
            <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentAnime.type}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentAnime.duration || '24m'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentAnime.otherInfo?.[0] || '2024'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-[9px] md:text-[10px] font-black border border-primary/30 shadow-[0_0_15px_rgba(147,51,234,0.2)]">HD</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/50 text-sm md:text-lg leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-4 font-medium italic reveal-item reveal-4 drop-shadow-md hidden xs:block">
            {currentAnime.description || "A thrilling journey awaits as the boundaries between worlds blur. Experience the ultimate tale of courage, destiny, and the unbreakable bonds of friendship."}
          </p>

          {/* Action Buttons with Glow */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-5 pt-4 md:pt-6 reveal-item reveal-5">
            <Link href={`/watch/${currentAnime.id}`} className="w-full sm:w-auto">
              <Button className="w-full h-12 md:h-16 px-8 md:px-12 rounded-full bg-gradient-to-r from-primary to-purple-400 hover:from-purple-400 hover:to-primary text-black font-black uppercase tracking-[0.2em] text-[12px] md:text-[14px] shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group">
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current group-hover:scale-110 transition-transform" />
                Watch Now
              </Button>
            </Link>
            <Link href={`/anime/${currentAnime.id}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 sm:h-16 px-8 sm:px-10 rounded-full border-white/20 bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-white font-black uppercase tracking-[0.2em] text-[12px] sm:text-[14px] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]">
                <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                Detail
              </Button>
            </Link>

          </div>
        </div>
      </div>

      {/* Floating Pagination Controls with Cyberpunk Style */}
      <div className="absolute bottom-8 right-4 md:bottom-12 md:right-8 lg:right-16 xl:right-20 flex flex-col gap-4 items-center z-20">
        <div className="flex flex-col gap-2">
          {animes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentDate(idx)}
              className={cn(
                "w-2 transition-all duration-500 rounded-full relative",
                idx === currentIndex ? "h-10 bg-primary shadow-[0_0_15px_rgba(147,51,234,0.8)]" : "h-2 bg-white/20 hover:bg-white/40"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            >
              {idx === currentIndex && (
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75" />
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDate((prev) => (prev - 1 + animes.length) % animes.length)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 text-white border border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] hidden md:flex transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDate((prev) => (prev + 1) % animes.length)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 text-white border border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(147,51,234,0.3)] hidden md:flex transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
