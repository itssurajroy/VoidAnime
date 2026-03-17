'use client';

import { useState } from 'react';
import { BookmarkPlus, Bell, Heart, Share2, Play, Search } from 'lucide-react';
import { ConsumptionModal } from '@/components/shared/ConsumptionModal';

interface AnimeActionButtonsProps {
  media: any;
}

export function AnimeActionButtons({ media }: AnimeActionButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const legalSources = media.externalLinks
    ?.filter((link: any) => link.type === 'STREAMING')
    .map((link: any) => ({ site: link.site, url: link.url })) || [];

  return (
    <>
      {/* Desktop & Tablet Inline Bar */}
      <div className="hidden sm:flex flex-wrap items-center gap-3 pt-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:bg-gray-200 hover:-translate-y-1"
        >
          <Search className="w-4 h-4" /> Where to Watch
        </button>
        <button className="flex items-center justify-center gap-2 bg-anime-primary/20 hover:bg-anime-primary/30 border border-anime-primary/30 text-anime-primary px-6 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-1 backdrop-blur-md">
          <BookmarkPlus className="w-5 h-5" /> Add to List
        </button>
        <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-[#2A2A2A] text-white px-6 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-1 backdrop-blur-md">
          <Bell className="w-4 h-4" /> Notify
        </button>
        <div className="flex gap-2">
          <button className="p-3.5 bg-[#212121] hover:bg-white/10 border border-[#2A2A2A] rounded-xl text-white transition-all hover:-translate-y-1 backdrop-blur-md group" title="Favorite">
            <Heart className="w-5 h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
          </button>
          <button className="p-3.5 bg-[#212121] hover:bg-white/10 border border-[#2A2A2A] rounded-xl text-white transition-all hover:-translate-y-1 backdrop-blur-md" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Fixed Action Bar */}
      <div className="sm:hidden fixed bottom-20 left-0 right-0 z-40 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 shadow-2xl border-white/10">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black h-12 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg"
          >
            <Search className="w-4 h-4" /> Where to Watch
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-anime-primary/20 border border-anime-primary/30 text-anime-primary rounded-xl">
            <BookmarkPlus className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 flex items-center justify-center bg-white/10 border border-[#2A2A2A] text-white rounded-xl">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ConsumptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={media.title.english || media.title.romaji}
        type="anime"
        legalSources={legalSources}
      />
    </>
  );
}
