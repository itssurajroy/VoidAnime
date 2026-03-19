'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Info, ChevronLeft, ChevronRight, Zap, BookmarkPlus, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpotlightAnime {
  id: string;
  name: string;
  jname?: string;
  poster: string;
  description: string;
  rank: number;
  otherInfo: string[];
}

export function HeroCarousel({ spotlights }: { spotlights: SpotlightAnime[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    duration: 40,
    skipSnaps: false,
  }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback((emblaApi: any) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect, onScroll]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (!spotlights?.length) return null;

  return (
    <section className="relative w-full h-screen min-h-[700px] bg-black overflow-hidden select-none">
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full w-full">
          {spotlights.map((anime, index) => {
            const isActive = index === selectedIndex;
            
            return (
              <div key={anime.id} className="relative flex-[0_0_100%] min-w-0 h-full w-full overflow-hidden">
                {/* Parallax Background Layer */}
                <motion.div 
                  initial={{ scale: 1.15 }}
                  animate={{ 
                    scale: isActive ? 1.05 : 1.15,
                    x: isActive ? 0 : (index > selectedIndex ? 50 : -50)
                  }}
                  transition={{ duration: 0.6, type: "tween", ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={anime.poster}
                    alt={anime.name}
                    fill
                    className="object-cover object-center opacity-60"
                    priority={index === 0}
                    sizes="100vw"
                    quality={100}
                  />
                </motion.div>

                {/* Dynamic Gradient System */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent z-10" />
                  
                  {/* Moving Accent Gradient */}
                  <motion.div 
                    animate={{ 
                      x: isActive ? ['-20%', '20%'] : '0%',
                      opacity: isActive ? [0.1, 0.2, 0.1] : 0
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.15),transparent_70%)] z-10"
                  />
                </motion.div>

                {/* Content Architecture */}
                <div className="relative h-full w-full z-20 flex items-center">
                  <div className="container mx-auto px-6 sm:px-12 lg:px-20 mt-20">
                    <div className="max-w-4xl space-y-8">
                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, type: "tween", ease: "easeOut", delay: 0.1 }}
                            className="space-y-6"
                          >
                            {/* Premium Status Badge */}
                            <div className="flex items-center gap-4">
                              <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-primary shadow-[0_0_25px_rgba(147,51,234,0.5)] border border-primary/50"
                              >
                                <Zap className="w-4 h-4 fill-white text-white" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                                  Trending #1
                                </span>
                              </motion.div>
                              
                              <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-[12px] font-black text-white/80 uppercase tracking-widest">
                                  Spotlight #{anime.rank}
                                </span>
                              </div>
                            </div>

                            {/* Ultra-Bold Headline Title */}
                            <div className="space-y-2">
                              <h1 className="text-5xl sm:text-7xl lg:text-9xl text-headline text-white text-shadow-strong">
                                {anime.name}
                              </h1>
                              {anime.jname && (
                                <p className="text-xl sm:text-2xl font-black text-primary/60 italic tracking-tight line-clamp-1 ml-2">
                                  {anime.jname}
                                </p>
                              )}
                            </div>

                            {/* Synopsis Section */}
                            <p className="max-w-2xl text-lg text-white/60 font-medium leading-relaxed line-clamp-3 md:line-clamp-4 pl-6 border-l-4 border-primary/40 backdrop-blur-sm py-2">
                              {anime.description || "In a world of infinite possibilities, one story stands above all. Experience a journey that transcends boundaries and redefines excellence."}
                            </p>

                            {/* Call to Action Controls */}
                            <div className="flex flex-wrap items-center gap-6 pt-6">
                              <Link href={`/watch/${anime.id}`}>
                                <button className="group relative bg-primary text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(147,51,234,0.4)] overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                  <PlayCircle className="w-6 h-6 fill-white text-primary" />
                                  Watch Now
                                </button>
                              </Link>
                              
                              <Link href={`/anime/${anime.id}`}>
                                <button className="glass-morphism text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-white/10 transition-all border border-white/20 hover:scale-105 active:scale-95">
                                  <Info className="w-6 h-6 text-primary" />
                                  Details
                                </button>
                              </Link>

                              <button className="w-16 h-16 glass-morphism rounded-3xl flex items-center justify-center text-white hover:text-primary transition-all hover:scale-110 active:scale-95 group border-white/10">
                                <BookmarkPlus className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Premium Navigation Sidebar */}
      <div className="absolute right-8 sm:right-16 bottom-16 flex flex-col gap-8 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={scrollPrev}
            className="w-16 h-16 rounded-3xl glass-morphism flex items-center justify-center text-white/40 hover:text-white hover:bg-primary transition-all border border-white/10 group"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={scrollNext}
            className="w-16 h-16 rounded-3xl glass-morphism flex items-center justify-center text-white/40 hover:text-white hover:bg-primary transition-all border border-white/10 group"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dynamic Progress Indicator */}
        <div className="flex flex-col gap-3 px-2">
          {spotlights.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className="group flex items-center justify-end gap-4"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                index === selectedIndex ? 'text-primary opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-100'
              }`}>
                Slide {index + 1}
              </span>
              <div className={`transition-all duration-700 rounded-full ${
                index === selectedIndex
                  ? 'h-3 w-8 bg-primary shadow-[0_0_20px_rgba(147,51,234,0.8)]'
                  : 'h-2 w-2 bg-white/20 hover:bg-white/40'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Decorative Bottom Mesh */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </section>
  );
}
