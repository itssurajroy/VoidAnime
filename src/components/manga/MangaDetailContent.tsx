'use client';

import { useState } from 'react';
import { MangaDetailTabs } from './MangaDetailTabs';
import { MangaOverviewTab } from './MangaOverviewTab';
import { CharactersTab } from '@/components/anime/detail/CharactersTab';
import { ReviewsTab } from '@/components/anime/detail/tabs/ReviewsTab';
import { FranchiseTab } from '@/components/anime/detail/tabs/FranchiseTab';
import { GalleryTab } from '@/components/anime/detail/tabs/GalleryTab';
import { CommunityTab } from '@/components/anime/detail/tabs/CommunityTab';
import { StatsTab } from '@/components/anime/detail/tabs/StatsTab';

interface MangaDetailContentProps {
  media: any;
  actualChapters?: string;
  actualVolumes?: string;
}

export function MangaDetailContent({ media, actualChapters, actualVolumes }: MangaDetailContentProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <MangaDetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="w-full px-4 md:px-8 lg:px-12 relative z-30 mb-24 min-h-[500px] animate-slide-up">
        {activeTab === 'overview' && <MangaOverviewTab media={media} actualChapters={actualChapters} actualVolumes={actualVolumes} />}
        {activeTab === 'chapters' && <div className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]"><p className="text-zinc-400">Chapter list coming soon...</p></div>}
        {activeTab === 'characters' && <CharactersTab media={media} />}
        {activeTab === 'reviews' && <ReviewsTab media={media} />}
        {activeTab === 'franchise' && <FranchiseTab media={media} />}
        {activeTab === 'gallery' && <GalleryTab media={media} />}
        {activeTab === 'community' && <CommunityTab media={media} />}
        {activeTab === 'stats' && <StatsTab media={media} />}
      </div>
    </>
  );
}
