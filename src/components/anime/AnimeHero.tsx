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
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative h-full container max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 flex flex-col justify-center pt-20 md:pt-16 overflow-hidden">
        <div className="max-w-3xl space-y-5 md:space-y-8 relative z-30">

          {/* Status Badge */}
          <div className="reveal-item reveal-1 flex items-center gap-3">
            <span className="px-3 py-1 bg-primary text-black text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-md shadow-[0_0_20px_rgba(147,51,234,0.6)]">
              #{currentIndex + 1} Trending
            </span>
            <div className="flex items-center gap-2 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5">
              <Layers className="w-3 h-3 text-primary" />
              <span>{currentAnime.type || 'TV Series'}</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 reveal-item reveal-2">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[84px] font-[900] text-white uppercase tracking-tighter leading-[0.95] font-headline title-shadow drop-shadow-2xl line-clamp-2">
              {currentAnime.name}
            </h1>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2.5 text-[10px] md:text-[13px] font-black text-white/60 uppercase tracking-widest reveal-item reveal-3">
            <div className="flex items-center gap-2 text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentAnime.type}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentAnime.duration || '24m'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentAnime.otherInfo?.[0] || '2024'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-[9px] md:text-[10px] font-black border border-primary/30 shadow-[0_0_15px_rgba(147,51,234,0.2)]">HD</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-white/50 text-sm md:text-lg leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-4 font-medium italic reveal-item reveal-4 drop-shadow-md hidden xs:block">
            {currentAnime.description || "A thrilling journey awaits as the boundaries between worlds blur. Experience the ultimate tale of courage, destiny, and the unbreakable bonds of friendship."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-5 pt-4 md:pt-6 reveal-item reveal-5">
            <Link href={`/watch/${currentAnime.id}`} className="w-full sm:w-auto">
              <Button className="w-full h-12 md:h-16 px-8 md:px-12 rounded-full bg-gradient-to-r from-primary to-[#a855f7] hover:from-[#a855f7] hover:to-primary text-black font-black uppercase tracking-[0.2em] text-[12px] md:text-[14px] shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link href={`/anime/${currentAnime.id}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-12 sm:h-16 px-8 sm:px-10 rounded-full border-white/10 bg-white/[0.02] hover:bg-white/10 backdrop-blur-md text-white font-black uppercase tracking-[0.2em] text-[12px] sm:text-[14px] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                Detail
              </Button>
            </Link>

          </div>
        </div>
      </div>

      {/* Floating Pagination Controls */}
      <div className="absolute bottom-8 right-4 md:bottom-12 md:right-8 lg:right-16 xl:right-20 flex flex-col gap-4 items-center z-20">
        <div className="flex flex-col gap-2">
          {animes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentDate(idx)}
              className={cn(
                "w-1.5 transition-all duration-500 rounded-full",
                idx === currentIndex ? "h-8 bg-primary shadow-[0_0_15px_#8b5cf6]" : "h-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDate((prev) => (prev - 1 + animes.length) % animes.length)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/5 hidden md:flex"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDate((prev) => (prev + 1) % animes.length)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/5 hidden md:flex"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
