'use client';

import { cn } from '@/lib/utils/utils';

interface MangaDetailTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MangaDetailTabs({ activeTab, setActiveTab }: MangaDetailTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'chapters', label: 'Chapters' },
    { id: 'characters', label: 'Characters' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'franchise', label: 'Franchise' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'community', label: 'Community' },
    { id: 'stats', label: 'Stats' },
  ];

  return (
    <div className="sticky top-[80px] z-[90] w-full bg-[#0D0D0D]/80 backdrop-blur-xl border-y border-[#2A2A2A] mb-8">
      <div className="container mx-auto px-4 md:px-12">
        <div className="flex overflow-x-auto scrollbar-hide gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-4 text-sm font-black uppercase tracking-widest whitespace-nowrap transition-all border-b-2",
                activeTab === tab.id 
                  ? "border-anime-primary text-white" 
                  : "border-transparent text-zinc-400 hover:text-white/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
