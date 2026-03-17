'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Episode } from '@/types';
import { cn, normalizeEpisodeId } from '@/lib/utils';
import { Search, List, LayoutGrid, Play, AlertCircle } from 'lucide-react';

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId: string;
  animeId: string;
  onEpisodeSelect: (episode: Episode) => void;
}

const RANGE_SIZE = 100;

export default function EpisodeList({
  episodes,
  currentEpisodeId,
  onEpisodeSelect,
}: EpisodeListProps) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [rangeIndex, setRangeIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter(ep => 
      ep.number.toString().includes(search) || 
      (ep.title && ep.title.toLowerCase().includes(search.toLowerCase()))
    );
  }, [episodes, search]);

  const totalRanges = Math.ceil(filteredEpisodes.length / RANGE_SIZE);

  useEffect(() => {
    const currentIndex = filteredEpisodes.findIndex(ep => normalizeEpisodeId(ep.episodeId) === currentEpisodeId);
    if (currentIndex !== -1) {
      const newRange = Math.floor(currentIndex / RANGE_SIZE);
      setRangeIndex(newRange);
    }
  }, [currentEpisodeId, filteredEpisodes]);

  useEffect(() => {
    if (viewMode === 'list') {
        const activeItem = scrollRef.current?.querySelector('[data-active="true"]');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [rangeIndex, viewMode, currentEpisodeId]);

  const currentRangeStart = rangeIndex * RANGE_SIZE;
  const currentRangeEpisodes = filteredEpisodes.slice(currentRangeStart, currentRangeStart + RANGE_SIZE);

  return (
    <div className="flex flex-col h-full bg-transparent border-none overflow-hidden">
      <div className="p-6 border-b border-white/5 space-y-5 bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
            <h3 className="text-white font-black text-lg uppercase tracking-tighter">Episode List</h3>
          </div>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-primary text-black shadow-lg" : "text-white/20 hover:text-white")}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-primary text-black shadow-lg" : "text-white/20 hover:text-white")}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative group">
          <input
            id="episode-search"
            name="episode-search"
            type="text"
            placeholder="Search episode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            className="w-full h-11 bg-white/[0.03] border border-white/5 rounded-2xl pl-11 pr-4 text-white text-[13px] font-bold outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
          />

          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-primary transition-colors" />
        </div>

        {totalRanges > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {Array.from({ length: totalRanges }).map((_, i) => {
                const start = i * RANGE_SIZE + 1;
                const end = Math.min((i + 1) * RANGE_SIZE, filteredEpisodes.length);
                const isSelected = rangeIndex === i;
                return (
                    <button
                        key={i}
                        onClick={() => setRangeIndex(i)}
                        className={cn(
                            "shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                            isSelected 
                                ? "bg-primary/10 border-primary/40 text-primary shadow-lg shadow-primary/5" 
                                : "bg-white/5 border-white/5 text-white/30 hover:text-white/60"
                        )}
                    >
                        {start}-{end}
                    </button>
                )
            })}
          </div>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6 bg-transparent">
        {currentRangeEpisodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20 space-y-4 py-20">
                <AlertCircle className="w-12 h-12" />
                <p className="text-[12px] font-black uppercase tracking-[0.2em]">No Episodes Found</p>
            </div>
        ) : viewMode === 'list' ? (
          <div className="flex flex-col gap-2">
            {currentRangeEpisodes.map((episode) => {
              const isActive = normalizeEpisodeId(episode.episodeId) === currentEpisodeId;
              return (
                <button
                  key={episode.episodeId}
                  onClick={() => onEpisodeSelect(episode)}
                  data-active={isActive}
                  className={cn(
                    "flex items-center gap-4 px-4 h-[60px] text-left rounded-2xl transition-all group/ep relative overflow-hidden border",
                    isActive 
                      ? "bg-primary/10 border-primary/30" 
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                  )}
                >
                  <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500",
                      isActive ? "bg-primary border-primary text-black shadow-lg shadow-primary/20" : "bg-black/40 border-white/5 text-white/20 group-hover/ep:border-primary/40 group-hover/ep:text-primary"
                  )}>
                    {isActive ? <Play className="w-4 h-4 fill-current" /> : <span className="text-[12px] font-black">{episode.number}</span>}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                        "text-[14px] font-black truncate tracking-tight transition-colors",
                        isActive ? "text-white" : "text-white/60 group-hover/ep:text-white"
                    )}>
                        {episode.title || `Episode ${episode.number}`}
                    </p>
                    {episode.isFiller && (
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest leading-none flex items-center gap-1.5 mt-0.5">
                            <div className="w-1 h-1 rounded-full bg-orange-500" />
                            Filler Content
                        </span>
                    )}
                  </div>

                  {isActive && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary animate-pulse shadow-[0_0_15px_#8b5cf6]" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {currentRangeEpisodes.map((episode) => {
              const isActive = normalizeEpisodeId(episode.episodeId) === currentEpisodeId;
              return (
                <button
                  key={episode.episodeId}
                  onClick={() => onEpisodeSelect(episode)}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-2xl text-[13px] font-black transition-all active:scale-90 border group/grid relative",
                    isActive 
                      ? "bg-primary border-primary text-black shadow-xl shadow-primary/30" 
                      : "bg-white/[0.03] border-white/5 text-white/30 hover:border-primary/40 hover:text-primary hover:bg-primary/5",
                    episode.isFiller && !isActive && "text-orange-500/40 border-orange-500/10"
                  )}
                  title={episode.title}
                >
                  {episode.number}
                  {episode.isFiller && (
                      <div className={cn("absolute bottom-2 w-1.5 h-1.5 rounded-full", isActive ? "bg-black" : "bg-orange-500/60 shadow-[0_0_10px_rgba(249,115,22,0.5)]")} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
