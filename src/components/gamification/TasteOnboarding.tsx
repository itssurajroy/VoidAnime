'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, EyeOff, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const INITIAL_TITLES = [
  { id: 113415, title: 'Jujutsu Kaisen', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg', genres: ['Action', 'Supernatural'] },
  { id: 1535, title: 'Death Note', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-4rHwQscM0t3z.jpg', genres: ['Psychological', 'Thriller'] },
  { id: 16498, title: 'Attack on Titan', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-m5ZMNtFioc7j.jpg', genres: ['Action', 'Drama'] },
  { id: 11061, title: 'Hunter x Hunter', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-sIoNOi9R2E1k.jpg', genres: ['Adventure', 'Fantasy'] },
  { id: 9253, title: 'Steins;Gate', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-1Qn7MIs2D48E.png', genres: ['Sci-Fi', 'Thriller'] },
];

export function TasteOnboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const currentAnime = INITIAL_TITLES[currentIndex];

  const handleSwipe = (type: 'like' | 'dislike' | 'skip') => {
    setDirection(type === 'like' ? 'right' : type === 'dislike' ? 'left' : 'up');
    
    setTimeout(() => {
      if (currentIndex < INITIAL_TITLES.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setDirection(null);
      } else {
        setIsComplete(true);
        setAnalyzing(true);
        // Simulate AI analysis delay
        setTimeout(() => setAnalyzing(false), 2500);
      }
    }, 300);
  };

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[#1A1A1A]/50 border border-[#2A2A2A] rounded-[40px] shadow-2xl backdrop-blur-3xl overflow-hidden relative min-h-[400px]">
        {analyzing ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 bg-anime-primary/20 rounded-full animate-ping" />
              <div className="absolute inset-2 bg-anime-secondary/40 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black font-heading text-white mb-2">Analyzing Preferences...</h3>
              <p className="text-zinc-400 text-sm font-mono uppercase tracking-widest">Mapping Your Interests</p>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 w-full max-w-sm"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-3xl font-black font-heading text-white leading-tight">Taste Profile<br/>Initialized.</h3>
            
            <div className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Detected Archetype</p>
              <p className="text-lg font-bold text-anime-primary">The Strategic Warrior</p>
              <p className="text-xs text-zinc-300 mt-1">High affinity for Action, Psychological, and Thriller narratives.</p>
            </div>

            <button className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              Start Exploring <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 md:p-10 bg-[#1A1A1A]/50 border border-[#2A2A2A] rounded-[40px] shadow-2xl backdrop-blur-3xl relative overflow-hidden">
      <div className="text-center mb-8">
         <h2 className="text-2xl font-heading font-black text-white">Discover Your Taste</h2>
         <p className="text-sm text-white/50 mt-1">Rate a few classics to personalize your discovery feed.</p>
         <div className="flex gap-1 justify-center mt-4">
           {INITIAL_TITLES.map((_, i) => (
             <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-anime-primary' : i < currentIndex ? 'w-2 bg-white/40' : 'w-2 bg-white/10'}`} />
           ))}
         </div>
      </div>

      <div className="relative w-full max-w-[240px] aspect-[2/3] mx-auto perspective-1000">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentAnime.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateY: 0,
              x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0,
              y: direction === 'up' ? -200 : 0,
              rotateZ: direction === 'left' ? -15 : direction === 'right' ? 15 : 0,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-0 rounded-3xl overflow-hidden border-4 border-[#2A2A2A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0D0D0D]"
          >
            <Image src={currentAnime.image} alt={currentAnime.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg">{currentAnime.title}</h3>
              <div className="flex gap-2 mt-2">
                {currentAnime.genres.map(g => (
                  <span key={g} className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[9px] font-black uppercase tracking-widest text-white">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6 mt-10 w-full">
        <button 
          onClick={() => handleSwipe('dislike')}
          disabled={direction !== null}
          className="w-16 h-16 rounded-full bg-[#0D0D0D] border border-red-500/30 flex items-center justify-center text-red-500 hover:bg-red-500/10 hover:scale-110 transition-all shadow-lg"
        >
          <ThumbsDown className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleSwipe('skip')}
          disabled={direction !== null}
          className="w-12 h-12 rounded-full bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center text-zinc-400 hover:bg-[#212121] hover:text-white hover:scale-110 transition-all shadow-lg"
        >
          <EyeOff className="w-5 h-5" />
        </button>
        <button 
          onClick={() => handleSwipe('like')}
          disabled={direction !== null}
          className="w-16 h-16 rounded-full bg-[#0D0D0D] border border-green-500/30 flex items-center justify-center text-green-500 hover:bg-green-500/10 hover:scale-110 transition-all shadow-lg shadow-green-500/20"
        >
          <ThumbsUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
