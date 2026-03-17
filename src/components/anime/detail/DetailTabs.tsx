'use client';

import { cn } from '@/lib/utils/utils';

interface DetailTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DetailTabs({ activeTab, setActiveTab }: DetailTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'episodes', label: 'Episodes' },
    { id: 'characters', label: 'Characters' },
    { id: 'music', label: 'Music & OST' },
    { id: 'franchise', label: 'Franchise' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'community', label: 'Community' },
    { id: 'tech', label: 'Tech Specs' },
    { id: 'stats', label: 'Stats' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="sticky top-[80px] z-[90] w-full glass-navbar mb-8">
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
