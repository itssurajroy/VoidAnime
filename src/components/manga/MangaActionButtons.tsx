'use client';

import { useState } from 'react';
import { BookmarkPlus, BellRing, Heart, Share2, Search } from 'lucide-react';
import { ConsumptionModal } from '@/components/shared/ConsumptionModal';

interface MangaActionButtonsProps {
  media: any;
}

export function MangaActionButtons({ media }: MangaActionButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const legalSources = media.externalLinks
    ?.filter((link: any) => link.type === 'STREAMING' || link.site.includes('Viz') || link.site.includes('Manga'))
    .map((link: any) => ({ site: link.site, url: link.url })) || [];

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 pt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1"
        >
          <Search className="w-5 h-5" /> Where to Read
        </button>

        {/* AdSense Info Note */}
        <div className="w-full mt-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest opacity-40">
          Official Licensing Index • Digital & Print Sources
        </div>
        
        {/* Placeholder for MangaDex logic if needed */}
        <button className="flex items-center gap-3 bg-anime-secondary hover:bg-[#6b25a8] text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-1 group">
          <BellRing className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Notify New Chapters
        </button>

        <div className="flex gap-3">
          <button className="p-4 bg-[#1A1A1A]/50 hover:bg-white/10 backdrop-blur-2xl border border-[#2A2A2A] rounded-2xl text-white transition-all hover:-translate-y-1 group" title="Favorite">
            <Heart className="w-5 h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
          </button>
          <button className="p-4 bg-[#1A1A1A]/50 hover:bg-white/10 backdrop-blur-2xl border border-[#2A2A2A] rounded-2xl text-white transition-all hover:-translate-y-1" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ConsumptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={media.title.english || media.title.romaji}
        type="manga"
        legalSources={legalSources}
      />
    </>
  );
}
