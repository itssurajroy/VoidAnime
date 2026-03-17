'use client';

import Image from 'next/image';
import { Star, Play, Bell, Info } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import { AnimeActionButtons } from './AnimeActionButtons';
import { AiringCountdown } from './AiringCountdown';

interface DetailHeroProps {
  media: any;
  color: string;
}

export function DetailHero({ media, color }: DetailHeroProps) {
  const [showTrailer, setShowTrailer] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [0.5, 0]);

  const title = media.title.english || media.title.romaji;
  
  // Status Ribbon Logic
  const statusColor = media.status === 'RELEASING' ? 'bg-green-500 text-white' : 
                      media.status === 'NOT_YET_RELEASED' ? 'bg-orange-500 text-white' : 
                      'bg-blue-500 text-white';
  
  const statusText = media.status === 'RELEASING' ? 'Airing Now' :
                     media.status === 'NOT_YET_RELEASED' ? 'Upcoming' : 'Finished';

  return (
    <>
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[75vh] min-h-[350px] sm:min-h-[450px] md:min-h-[500px] overflow-hidden">
        {/* Parallax Blurred Background */}
        <motion.div className="absolute inset-0" style={{ y, opacity }}>
          <Image 
            src={media.bannerImage || media.coverImage.extraLarge} 
            alt="Banner" 
            fill 
            priority
            className="object-cover blur-xl scale-110 saturate-150"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-[var(--color-dark-bg)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-dark-bg)] via-[var(--color-dark-bg)]/80 to-transparent md:w-[80%]" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 pb-6 sm:pb-10 md:pb-12 flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-12 items-end">
            
            {/* Poster & Trailer Trigger */}
            <div className="relative w-32 sm:w-40 md:w-56 lg:w-64 shrink-0 aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.8)] sm:shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-[#2A2A2A] group z-20">
              <Image 
                src={media.coverImage.extraLarge} 
                alt={title} 
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {media.trailer?.id && (
                <div 
                  onClick={() => setShowTrailer(true)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer backdrop-blur-sm"
                >
                  <div className="w-16 h-16 rounded-full bg-anime-primary/90 flex items-center justify-center text-white shadow-[0_0_30px_rgba(157,78,221,0.6)]">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Main Info */}
            <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-5 animate-slide-up relative z-20 mb-2 sm:mb-4 md:mb-6 w-full">
              {/* Tags & Ribbon */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-lg ${statusColor} shadow-lg`}>
                  {statusText}
                </span>
                {media.genres?.slice(0, 3).map((g: string) => (
                  <span key={g} className="px-3 py-1 glass-panel rounded-lg text-[10px] font-black tracking-widest uppercase text-white/90">
                    {g}
                  </span>
                ))}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                  {title}
                </h1>
                {media.title.native && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl font-heading font-medium text-white/50 mt-1 sm:mt-2">{media.title.native}</p>
                )}
              </div>

              {/* Multi-Platform Scores */}
              <div className="flex flex-wrap items-center gap-4 glass-panel p-3 rounded-2xl w-fit shadow-2xl">
                 <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                   <div className="w-6 h-6 rounded bg-[#2b2d42] flex items-center justify-center text-[10px] font-black text-white">AL</div>
                   <div className="flex flex-col">
                     <span className="text-sm font-black text-white">{(media.averageScore / 10).toFixed(1)}</span>
                     <span className="text-[8px] text-zinc-400 uppercase font-bold tracking-widest">Score</span>
                   </div>
                 </div>
                 <div className="flex items-center gap-2 pr-4 border-r border-white/10">
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

              {/* Advanced Airing Countdown */}
              {media.status === 'RELEASING' && media.nextAiringEpisode && (
                <AiringCountdown 
                  episode={media.nextAiringEpisode.episode} 
                  airingAt={media.nextAiringEpisode.airingAt}
                  color={color}
                />
              )}

              {/* Action Bar Client Component */}
              <AnimeActionButtons media={media} />

            </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) */}
      {/* Keeping this for quick Add, but could be updated to Watch if preferred */}
      <div className="md:hidden fixed bottom-24 right-6 z-[100]">
        <button className="flex items-center justify-center gap-2 bg-anime-primary text-white px-6 py-4 rounded-full font-black uppercase tracking-widest text-sm shadow-[0_10px_40px_rgba(157,78,221,0.6)]">
          <Play className="w-5 h-5 fill-current" /> Watch
        </button>
      </div>

      {/* Trailer Modal */}
      {showTrailer && media.trailer?.id && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <div className="w-full max-w-5xl aspect-video relative rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(157,78,221,0.2)] border border-[#2A2A2A] animate-scale-in">
            <button 
              onClick={() => setShowTrailer(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Close trailer"
            >
              ✕
            </button>
            <iframe 
              src={`https://www.youtube.com/embed/${media.trailer.id}?autoplay=1&modestbranding=1&rel=0`} 
              className="w-full h-full"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      )}
    </>
  );
}
