'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronDown, List, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";

interface Episode {
  number: number;
  title: string;
  episodeId: string;
  isFiller: boolean;
}

interface EpisodeListProps {
  animeId: string;
  episodes: Episode[];
}

export function EpisodeList({ animeId, episodes }: EpisodeListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!episodes || episodes.length === 0) return null;

  const displayEpisodes = isExpanded ? episodes : episodes.slice(0, 24);
  const hasMore = episodes.length > 24;

  return (
    <section id="episodes" className="scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <SectionHeader 
          title="Episode List" 
          subtitle={`${episodes.length} Episodes available`} 
        />
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40">
            <Info className="w-3 h-3 text-primary" />
            Click an episode to start watching
          </div>
        </div>
      </div>

      <GlassPanel intensity="medium" className="p-4 md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-3">
          {displayEpisodes.map((ep) => (
            <Link 
              key={ep.episodeId} 
              href={`/watch/${ep.episodeId}`}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative aspect-video sm:aspect-square rounded-xl flex flex-col items-center justify-center border transition-all duration-300 overflow-hidden p-2 text-center",
                  ep.isFiller 
                    ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-500 hover:border-yellow-500/50" 
                    : "bg-white/5 border-white/10 text-white hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                {/* Background Number */}
                <span className="absolute top-0 right-2 text-3xl font-black opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                  {ep.number}
                </span>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <span className="text-lg font-black tracking-tighter">EP {ep.number}</span>
                  {ep.title && ep.title !== `Episode ${ep.number}` && (
                    <span className="text-[10px] font-bold text-white/40 line-clamp-2 px-2 group-hover:text-white/60 transition-colors uppercase tracking-wider">
                      {ep.title}
                    </span>
                  )}
                  {ep.isFiller && (
                    <span className="text-[8px] font-black uppercase tracking-tighter text-yellow-500/60">Filler</span>
                  )}
                </div>

                {/* Hover Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary/10 transition-opacity">
                  <Play className="w-6 h-6 fill-primary text-primary" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="group h-12 px-8 rounded-full border-white/10 bg-white/5 hover:bg-primary hover:text-black hover:border-primary transition-all duration-500 font-black uppercase tracking-[0.2em] text-[10px] gap-3"
            >
              <List className={cn("w-4 h-4 transition-transform duration-500", isExpanded && "rotate-180")} />
              {isExpanded ? 'Show Less' : `View All ${episodes.length} Episodes`}
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-500", isExpanded && "rotate-180")} />
            </Button>
          </div>
        )}
      </GlassPanel>
    </section>
  );
}
