'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { MediaCard } from './MediaCard';

export interface MediaCarouselProps {
  title: string;
  items: any[];
  type?: 'anime' | 'manga';
}

export function MediaCarousel({ title, items, type = 'anime' }: MediaCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const current = scrollContainerRef.current;
    if (current) {
      current.addEventListener('scroll', checkScroll);
      checkScroll();
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (current) current.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth * 0.8 : current.offsetWidth * 0.8;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group flex flex-col gap-4 sm:gap-6 py-2 sm:py-4 w-full">
      {title && (
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2 sm:gap-3">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-anime-primary" /> {title}
          </h2>
        </div>
      )}

      <div className="relative">
        {/* Navigation Arrows */}
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#2A2A2A] text-white hover:bg-anime-primary transition-all shadow-2xl -ml-4 hidden md:flex min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        
        {showRightArrow && (
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#2A2A2A] text-white hover:bg-anime-primary transition-all shadow-2xl -mr-4 hidden md:flex min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-4 sm:pb-6 pt-2 pr-4 scrollbar-hide snap-x snap-mandatory scroll-smooth overscroll-contain"
        >
          {items.map((item) => (
            <div key={item.id} className="snap-start shrink-0 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px]">
              <MediaCard 
                id={item.id} 
                title={item.title.english || item.title.romaji} 
                coverImage={item.coverImage.extraLarge || item.coverImage.large} 
                score={item.averageScore} 
                format={item.format}
                episodes={item.episodes || item.chapters}
                color={item.coverImage.color}
                type={type}
              />
            </div>
          ))}
        </div>

        {/* Edge Fades */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--color-dark-bg)] to-transparent pointer-events-none z-10 transition-opacity duration-300" />
        )}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--color-dark-bg)] to-transparent pointer-events-none z-10 transition-opacity duration-300" />
        )}
      </div>
    </div>
  );
}
