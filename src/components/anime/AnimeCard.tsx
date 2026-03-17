'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Plus, Check, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnimeCard as AnimeCardType } from '@/types';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';

interface AnimeCardProps {
  anime: AnimeCardType;
  priority?: boolean;
  showDetails?: boolean;
}

export function AnimeCard({ anime, priority = false, showDetails = true }: AnimeCardProps) {
  const { user } = useUser();
  const watchlist = useWatchlist();
  const [posterError, setPosterError] = useState(false);

  // Safety check for isInWatchlist function
  const inWatchlist = typeof watchlist?.isInWatchlist === 'function'
    ? watchlist.isInWatchlist(anime.id)
    : false;

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || typeof watchlist?.removeFromWatchlist !== 'function' || typeof watchlist?.addToWatchlist !== 'function') return;

    if (inWatchlist) {
      watchlist.removeFromWatchlist(anime.id);
    } else {
      watchlist.addToWatchlist(anime);
    }
  };

  return (
    <div className="group relative block w-full reveal-item">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card border border-white/5 shadow-lg transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-primary/20">
        <Link
          href={`/anime/${anime.id}`}
          className="absolute inset-0 z-10"
          aria-label={anime.name}
        />

        {!posterError && anime.poster ? (
          <Image
            src={anime.poster}
            alt={anime.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            onError={() => setPosterError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/[0.03] gap-3">
            <Film className="w-10 h-10 text-white/10" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/15">No Image</span>
          </div>
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 z-0" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20 pointer-events-none">
          <div className="flex items-center gap-1">
            <span className="px-2 py-0.5 bg-primary text-black text-[9px] font-black uppercase rounded shadow-lg shadow-primary/20">
              {anime.type || 'TV'}
            </span>
            {anime.episodes?.sub && (
              <span className="px-2 py-0.5 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase rounded border border-white/5">
                SUB {anime.episodes.sub}
              </span>
            )}
          </div>
        </div>

        {/* Rating Badge */}
        {anime.rating && (
          <div className="absolute top-3 right-3 z-20 pointer-events-none">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-black/40 backdrop-blur-md border border-white/5 rounded text-white text-[9px] font-black">
              <Star className="w-2.5 h-2.5 text-yellow-400 fill-current" />
              {anime.rating}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-0 right-0 px-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-30">
          <div className="flex items-center gap-2">
            <Link href={`/watch/${anime.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="secondary"
                className="w-full h-9 rounded-xl bg-white text-black hover:bg-white/90 font-black uppercase text-[10px] gap-2 shadow-xl"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play
              </Button>
            </Link>
            <Button
              onClick={handleWatchlist}
              size="icon"
              className={cn(
                "w-9 h-9 rounded-xl backdrop-blur-xl border transition-all duration-300",
                inWatchlist
                  ? "bg-primary border-primary text-black"
                  : "bg-black/40 border-white/10 text-white hover:bg-primary hover:border-primary hover:text-black"
              )}
            >
              {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Hover Highlight */}
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-primary/50 transition-all duration-500 rounded-2xl pointer-events-none z-20" />
      </div>

      {showDetails && (
        <Link href={`/anime/${anime.id}`} className="mt-4 block space-y-1 px-1">
          <h3 className="text-[14px] font-bold text-white group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">
            {anime.name}
          </h3>
          <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest tabular-nums">
            <span>{anime.type}</span>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <span>{anime.duration || '24m'}</span>
          </div>
        </Link>
      )}
    </div>

  );
}
