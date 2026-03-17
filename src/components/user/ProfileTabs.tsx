'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  List, BarChart2, Heart, MessageCircle, Settings, 
  Award, BookOpen, Clock, Star, Users
} from 'lucide-react';

type TabId = 'overview' | 'animelist' | 'mangalist' | 'reviews' | 'achievements' | 'followers' | 'settings';

interface Tab {
  id: TabId;
  label: string;
  href: string;
  icon: React.ElementType;
}

interface ProfileTabsProps {
  activeTab?: TabId;
  username?: string;
  isOwnProfile?: boolean;
  stats?: {
    animeCount: number;
    mangaCount: number;
    reviewCount: number;
    followerCount: number;
    followingCount: number;
  };
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', href: '/profile', icon: BarChart2 },
  { id: 'animelist', label: 'Anime List', href: '/profile?tab=anime', icon: List },
  { id: 'mangalist', label: 'Manga List', href: '/profile?tab=manga', icon: BookOpen },
  { id: 'reviews', label: 'Reviews', href: '/profile?tab=reviews', icon: MessageCircle },
  { id: 'achievements', label: 'Achievements', href: '/profile?tab=achievements', icon: Award },
  { id: 'followers', label: 'Followers', href: '/profile?tab=followers', icon: Users },
];

const OWN_PROFILE_TABS: Tab[] = [
  { id: 'overview', label: 'Overview', href: '/profile', icon: BarChart2 },
  { id: 'animelist', label: 'Anime', href: '/profile?tab=anime', icon: List },
  { id: 'mangalist', label: 'Manga', href: '/profile?tab=manga', icon: BookOpen },
  { id: 'reviews', label: 'Reviews', href: '/profile?tab=reviews', icon: MessageCircle },
  { id: 'achievements', label: 'Badges', href: '/profile?tab=achievements', icon: Award },
  { id: 'settings', label: 'Settings', href: '/profile/settings', icon: Settings },
];

export function ProfileTabs({ activeTab = 'overview', username, isOwnProfile = false, stats }: ProfileTabsProps) {
  const pathname = usePathname();
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  
  const tabs = isOwnProfile ? OWN_PROFILE_TABS : TABS;
  const baseHref = isOwnProfile ? '/profile' : `/u/${username}`;

  const getTabHref = (tab: Tab) => {
    if (tab.id === 'settings') return tab.href;
    if (tab.id === 'overview') return baseHref;
    return `${baseHref}?tab=${tab.id}`;
  };

  return (
    <div className="w-full">
      {/* Desktop Tabs */}
      <div className="hidden md:flex items-center gap-1 p-1 bg-[#1a1a2e]/60 backdrop-blur-xl rounded-2xl border border-white/5 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.id}
              href={getTabHref(tab)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className={`relative flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                isActive 
                  ? 'text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-anime-primary' : ''}`} />
              <span>{tab.label}</span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-anime-primary/20 to-anime-secondary/20 border border-anime-primary/30 rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              
              {/* Hover Effect */}
              <AnimatePresence>
                {hoveredTab === tab.id && !isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/5 rounded-xl"
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Mobile Tabs - Horizontal Scroll */}
      <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <Link
              key={tab.id}
              href={getTabHref(tab)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isActive 
                  ? 'bg-anime-primary text-white' 
                  : 'bg-[#1a1a2e] text-zinc-400 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Stats Summary for Mobile */}
      {stats && (
        <div className="md:hidden grid grid-cols-4 gap-2 mt-4">
          <div className="p-3 bg-[#1a1a2e]/60 rounded-xl text-center">
            <p className="text-lg font-black text-white">{stats.animeCount}</p>
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Anime</p>
          </div>
          <div className="p-3 bg-[#1a1a2e]/60 rounded-xl text-center">
            <p className="text-lg font-black text-white">{stats.mangaCount}</p>
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Manga</p>
          </div>
          <div className="p-3 bg-[#1a1a2e]/60 rounded-xl text-center">
            <p className="text-lg font-black text-white">{stats.reviewCount}</p>
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Reviews</p>
          </div>
          <div className="p-3 bg-[#1a1a2e]/60 rounded-xl text-center">
            <p className="text-lg font-black text-white">{stats.followerCount}</p>
            <p className="text-[9px] font-bold text-zinc-500 uppercase">Followers</p>
          </div>
        </div>
      )}
    </div>
  );
}
