'use client';

import Image from 'next/image';
import { Star, BookOpen, Bell } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import { MangaActionButtons } from '@/components/manga/MangaActionButtons';

interface MangaDetailHeroProps {
  media: any;
  color: string;
  actualChapters?: string;
  actualVolumes?: string;
  isMangaDexSourced?: boolean;
}

export function MangaDetailHero({ media, color, actualChapters, actualVolumes, isMangaDexSourced }: MangaDetailHeroProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [0.5, 0]);

  const title = media.title.english || media.title.romaji;
  
  const statusColor = media.status === 'RELEASING' ? 'bg-green-500 text-white' : 
                      media.status === 'NOT_YET_RELEASED' ? 'bg-orange-500 text-white' : 
                      'bg-blue-500 text-white';
  
  const statusText = media.status === 'RELEASING' ? 'Publishing' :
                     media.status === 'NOT_YET_RELEASED' ? 'Upcoming' : 'Finished';

  const demographic = media.tags?.find((t: any) => 
    ['shounen', 'seinen', 'shoujo', 'josei'].includes(t.name.toLowerCase())
  )?.name;

  return (
    <>
      <div className="relative w-full h-[60vh] md:h-[75vh] min-h-[500px] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y, opacity }}>
          <Image 
            src={media.bannerImage || media.coverImage.extraLarge} 
            alt="Banner" 
            fill 
            priority
            className="object-cover blur-xl scale-110 saturate-150"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent md:w-[80%]" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-12 pb-12 flex flex-col md:flex-row gap-8 md:gap-12 items-end">
            
            <div className="relative w-40 md:w-64 shrink-0 aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-[#2A2A2A] group z-20">
              <Image 
                src={media.coverImage.extraLarge} 
                alt={title} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="flex-1 space-y-5 animate-slide-up relative z-20 mb-2 md:mb-6 w-full">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg ${statusColor} shadow-lg`}>
                  {statusText}
                </span>
                {demographic && (
                  <span className="px-3 py-1 bg-anime-primary/20 text-anime-primary border border-anime-primary/30 rounded-lg text-[10px] font-black tracking-widest uppercase backdrop-blur-md">
                    {demographic}
                  </span>
                )}
                {media.genres?.slice(0, 2).map((g: string) => (
                  <span key={g} className="px-3 py-1 bg-[#212121] border border-[#2A2A2A] rounded-lg text-[10px] font-black tracking-widest uppercase text-white/70 backdrop-blur-md">
                    {g}
                  </span>
                ))}
              </div>

              <div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                  {title}
                </h1>
                {media.title.native && (
                  <p className="text-lg md:text-xl font-heading font-medium text-white/50 mt-1">{media.title.native}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-[#1A1A1A]/50 border border-[#2A2A2A] backdrop-blur-xl p-3 rounded-2xl w-fit">
                <div className="flex items-center gap-2 pr-4 border-r border-[#2A2A2A]">
                  <div className="w-6 h-6 rounded bg-[#2b2d42] flex items-center justify-center text-[10px] font-black text-white">AL</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white">{(media.averageScore / 10).toFixed(1)}</span>
                    <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest">Score</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pr-4 border-r border-[#2A2A2A]">
                  <div className="w-6 h-6 rounded bg-[#2e51a2] flex items-center justify-center text-[10px] font-black text-white">MAL</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white">{media.malDetails?.score || 'N/A'}</span>
                    <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest">Score</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white">Rate</span>
                    <span className="text-[8px] text-anime-primary uppercase font-bold tracking-widest">Your Score</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/70 font-medium">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-anime-secondary" />
                  <span>{actualChapters || '?'} Chapters</span>
                  {isMangaDexSourced && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-md border border-green-500/30 uppercase tracking-widest font-bold animate-pulse">Live Sync</span>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <span>{actualVolumes || '?'} Volumes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span>{media.popularity?.toLocaleString('en-US')} Members</span>
                </div>
              </div>

              <MangaActionButtons media={media} />

            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-24 right-6 z-[100]">
        <button className="flex items-center justify-center gap-2 bg-anime-primary text-white px-6 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-[0_10px_40px_rgba(157,78,221,0.6)]">
          <BookOpen className="w-5 h-5 fill-current" /> Read
        </button>
      </div>
    </>
  );
}
