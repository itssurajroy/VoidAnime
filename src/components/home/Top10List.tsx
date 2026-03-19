'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Top10Anime {
  id: string;
  name: string;
  jname?: string;
  poster: string;
  rank: number;
  episodes: {
    sub?: number;
    dub?: number;
  };
}

interface Top10Data {
  today: Top10Anime[];
  week: Top10Anime[];
  month: Top10Anime[];
}

export function Top10List({ data }: { data: Top10Data }) {
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');

  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
  ];

  const currentData = data[activeTab] || [];

  return (
    <div className="w-full bg-[#0a0a0a] rounded-[32px] p-6 sm:p-8 border border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-[20px] font-black text-white uppercase tracking-wider">Top 10</h2>
        </div>

        <div className="flex bg-white/5 rounded-full p-1 border border-white/10 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {currentData.slice(0, 10).map((anime, index) => (
              <Link 
                key={anime.id} 
                href={`/anime/${anime.id}`}
                className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
              >
                {/* Rank */}
                <div className={`w-10 text-center font-black text-2xl ${
                  index === 0 ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]' :
                  index === 1 ? 'text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]' :
                  index === 2 ? 'text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]' :
                  'text-white/20'
                }`}>
                  {anime.rank || index + 1}
                </div>

                {/* Poster */}
                <div className="relative w-[60px] h-[80px] rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={anime.poster}
                    alt={anime.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="60px"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-white leading-tight line-clamp-1 group-hover:text-primary transition-colors mb-2">
                    {anime.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {anime.episodes?.sub && (
                      <span className="bg-primary/20 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        CC {anime.episodes.sub}
                      </span>
                    )}
                    {anime.episodes?.dub && (
                      <span className="bg-white/10 text-white/70 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        MIC {anime.episodes.dub}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
