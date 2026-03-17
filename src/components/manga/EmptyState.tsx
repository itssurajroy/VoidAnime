'use client';

import { Search, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  section: 'chapters' | 'characters' | 'reviews' | 'recommendations' | 'stats' | 'gallery';
  onRetry?: () => void;
}

const EMPTY_CONFIG = {
  chapters: {
    icon: '📋',
    title: 'Archive Empty',
    description: 'Chapter data is unavailable from our core sources right now.',
    action: 'Check MangaDex',
    actionUrl: 'https://mangadex.org',
  },
  characters: {
    icon: '👥',
    title: 'Cast Redacted',
    description: 'Character data couldn\'t be synchronized from the cloud.',
    action: 'Try Again',
    actionUrl: null,
  },
  reviews: {
    icon: '✍️',
    title: 'No Intel',
    description: 'Be the first reader to submit a field report on this series.',
    action: 'Submit Review',
    actionUrl: null,
  },
  recommendations: {
    icon: '🔍',
    title: 'No Matches',
    description: 'We couldn\'t find any similar matches for this title.',
    action: 'Browse Genres',
    actionUrl: '/search',
  },
  stats: {
    icon: '📊',
    title: 'Data Unavailable',
    description: 'Community analytics failed to aggregate.',
    action: 'Re-sync',
    actionUrl: null,
  },
  gallery: {
    icon: '🖼️',
    title: 'Visuals Missing',
    description: 'Promotional art files are currently out of reach.',
    action: 'Retry',
    actionUrl: null,
  },
};

export default function EmptyState({ section, onRetry }: EmptyStateProps) {
  const config = EMPTY_CONFIG[section];

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center
                    border-2 border-dashed border-[#2A2A2A] rounded-[40px] bg-[#1A1A1A]/20 backdrop-blur-md space-y-6">
      <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(157,78,221,0.3)]">{config.icon}</div>
      <div className="space-y-2">
        <h3 className="text-2xl font-heading font-black text-white">{config.title}</h3>
        <p className="text-zinc-400 text-sm max-w-xs mx-auto font-medium">{config.description}</p>
      </div>
      
      {config.actionUrl ? (
        <a 
          href={config.actionUrl} 
          target={config.actionUrl.startsWith('http') ? '_blank' : '_self'}
          className="px-8 py-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white font-black uppercase tracking-widest text-[10px]
                     hover:bg-white hover:text-black transition-all shadow-xl"
        >
          {config.action} →
        </a>
      ) : (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-anime-primary/10 border border-anime-primary/20 text-anime-accent font-black uppercase tracking-widest text-[10px]
                     hover:bg-anime-primary hover:text-white transition-all shadow-xl"
        >
          <RotateCcw className="w-3 h-3" />
          {config.action}
        </button>
      )}
    </div>
  );
}
