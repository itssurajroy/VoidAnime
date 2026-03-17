'use client';

import { useState } from 'react';
import { DetailTabs } from './DetailTabs';
import { OverviewTab } from './OverviewTab';
import { EpisodesTab } from './EpisodesTab';
import { CharactersTab } from './CharactersTab';
import { StatsTab } from './tabs/StatsTab';
import { MusicTab } from './tabs/MusicTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { FranchiseTab } from './tabs/FranchiseTab';
import { GalleryTab } from './tabs/GalleryTab';
import { CommunityTab } from './tabs/CommunityTab';
import { TechSpecsTab } from './tabs/TechSpecsTab';

interface DetailContentProps {
  media: any;
}

export function DetailContent({ media }: DetailContentProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <DetailTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="w-full px-4 md:px-8 lg:px-12 relative z-30 mb-24 min-h-[500px] animate-slide-up">
        {activeTab === 'overview' && <OverviewTab media={media} />}
        {activeTab === 'episodes' && <EpisodesTab media={media} />}
        {activeTab === 'characters' && <CharactersTab media={media} />}
        {activeTab === 'franchise' && <FranchiseTab media={media} />}
        {activeTab === 'gallery' && <GalleryTab media={media} />}
        {activeTab === 'community' && <CommunityTab media={media} />}
        {activeTab === 'stats' && <StatsTab media={media} />}
        {activeTab === 'music' && <MusicTab media={media} />}
        {activeTab === 'tech' && <TechSpecsTab media={media} />}
        {activeTab === 'reviews' && <ReviewsTab media={media} />}
      </div>
    </>
  );
}
