'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { ConsumptionModal } from '@/components/shared/ConsumptionModal';

export function EpisodesTab({ media }: { media: any }) {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use real streaming episodes from AniList
  const episodes = media.streamingEpisodes || [];

  const handleEpisodeClick = (epIndex: number) => {
    setSelectedEpisode(epIndex + 1);
    setIsModalOpen(true);
  };

  const legalSources = media.externalLinks
    ?.filter((link: any) => link.type === 'STREAMING')
    .map((link: any) => ({ site: link.site, url: link.url })) || [];

  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-[#2A2A2A] rounded-[40px] bg-[#1A1A1A]/20">
        <Play className="w-12 h-12 text-white/10 mb-4" />
        <h3 className="text-xl font-heading font-black text-zinc-400 mb-2 uppercase tracking-widest">No Episode Data</h3>
        <p className="text-sm text-white/20 max-w-xs mx-auto">Streaming metadata for this series hasn't been synchronized yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-heading font-black text-white">Episode Guide</h2>
        <div className="px-4 py-1.5 rounded-full bg-[#212121] border border-[#2A2A2A] text-[10px] font-black uppercase tracking-widest text-zinc-400">
          {episodes.length} Episodes Linked
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {episodes.map((ep: any, i: number) => (
          <div 
            key={i} 
            onClick={() => handleEpisodeClick(i)}
            className="flex gap-4 p-3 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] hover:bg-[#212121] transition-all cursor-pointer group shadow-xl"
          >
            <div className="relative w-32 md:w-44 h-20 md:h-28 rounded-2xl overflow-hidden shrink-0 border border-[#2A2A2A] shadow-lg">
              <Image 
                src={ep.thumbnail || media.coverImage.large} 
                alt={ep.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white fill-current shadow-2xl" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0 flex flex-col justify-center pr-2">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-black text-anime-primary">EP {i + 1}</span>
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest truncate">{ep.site}</span>
              </div>
              <h4 className="text-sm md:text-base font-bold text-white line-clamp-2 leading-tight group-hover:text-anime-accent transition-colors">{ep.title}</h4>
              
              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-anime-accent">Watch Now</span>
                <ExternalLink className="w-2.5 h-2.5 text-anime-accent" />
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className="self-center p-4 text-white/5 hover:text-green-400 transition-all hover:scale-110"
            >
              <CheckCircle2 className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      <ConsumptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        episodeOrChapter={selectedEpisode || 1}
        title={media.title.english || media.title.romaji}
        type="anime"
        legalSources={legalSources}
      />
    </div>
  );
}
