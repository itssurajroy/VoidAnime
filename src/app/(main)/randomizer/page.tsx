'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Shuffle, Filter, X, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AnimeItem {
  id: number;
  title: string;
  image: string;
  episodes: number;
  format: string;
}

const MOCK_PTW_LIST: AnimeItem[] = [
  { id: 21, title: 'One Piece', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-tXMN3Y20PIL9.jpg', episodes: 1100, format: 'TV' },
  { id: 1535, title: 'Death Note', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535.jpg', episodes: 37, format: 'TV' },
  { id: 5114, title: 'Fullmetal Alchemist: Brotherhood', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114.jpg', episodes: 64, format: 'TV' },
  { id: 16498, title: 'Attack on Titan', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-NF7L9N3XAk4y6T6Lh4i0K6g3F.jpg', episodes: 94, format: 'TV' },
  { id: 113415, title: 'Jujutsu Kaisen', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg', episodes: 24, format: 'TV' },
  { id: 101922, title: 'Mob Psycho 100', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-fMPu2GksC4e6F6zdN6Y2t2xa7h.jpg', episodes: 25, format: 'TV' },
  { id: 20464, title: 'Spy x Family', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20464-Zkyy0u84XSw7kfRQuzmu2D6d.jpg', episodes: 25, format: 'TV' },
  { id: 1, title: 'Cowboy Bebop', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1.jpg', episodes: 26, format: 'TV' },
  { id: 11061, title: 'Hunter x Hunter', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061.jpg', episodes: 148, format: 'TV' },
  { id: 1575, title: 'Code Geass', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1575.jpg', episodes: 50, format: 'TV' },
];

const FILTERS = [
  { id: 'all', label: 'Any Length' },
  { id: 'short', label: 'Short (< 25 eps)' },
  { id: 'medium', label: 'Medium (25-50 eps)' },
  { id: 'long', label: 'Long (50+ eps)' },
];

export default function RandomizerPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<AnimeItem | null>(null);
  const [history, setHistory] = useState<AnimeItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredList = MOCK_PTW_LIST.filter(anime => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'short') return anime.episodes < 25;
    if (activeFilter === 'medium') return anime.episodes >= 25 && anime.episodes <= 50;
    if (activeFilter === 'long') return anime.episodes > 50;
    return true;
  });

  const spinWheel = async () => {
    if (isSpinning || filteredList.length === 0) return;
    
    setIsSpinning(true);
    setResult(null);

    const spins = 10 + Math.floor(Math.random() * 10);
    for (let i = 0; i < spins; i++) {
      const randomIndex = Math.floor(Math.random() * filteredList.length);
      setResult(filteredList[randomIndex]);
      await new Promise(resolve => setTimeout(resolve, 100 + i * 20));
    }

    setIsSpinning(false);
  };

  const respin = () => {
    if (result) {
      setHistory(prev => [result, ...prev.slice(0, 4)]);
    }
    spinWheel();
  };

  const removeFromHistory = (anime: AnimeItem) => {
    setHistory(prev => prev.filter(a => a.id !== anime.id));
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shuffle className="w-8 h-8 text-anime-primary" />
            <span className="text-sm font-black uppercase tracking-widest text-zinc-500">Pick For Me</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Watchlist Randomizer
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Can&apos;t decide what to watch? Spin the wheel and let fate choose your next anime!
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl text-white font-bold hover:border-anime-primary transition-all"
          >
            <Filter className="w-4 h-4" /> 
            Filter: {FILTERS.find(f => f.id === activeFilter)?.label}
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            {FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => { setActiveFilter(filter.id); setShowFilters(false); }}
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                  activeFilter === filter.id
                    ? 'bg-anime-primary text-white'
                    : 'bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>
        )}

        <div className="mb-12">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto"
              >
                <div className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-[40px] overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-anime-primary via-anime-secondary to-anime-accent" />
                  
                  <div className="relative aspect-[3/4] max-h-[400px] mx-auto">
                    <Image
                      src={result.image}
                      alt={result.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4 px-3 py-1 bg-anime-primary rounded-full">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    <h2 className="text-2xl font-heading font-black text-white mb-2">
                      {result.title}
                    </h2>
                    <p className="text-zinc-400 mb-6">
                      {result.episodes} episodes • {result.format}
                    </p>

                    <div className="flex gap-3">
                      <Link
                        href={`/anime/${result.title.toLowerCase().replace(/\s+/g, '-')}-${result.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-anime-primary text-white font-bold rounded-2xl hover:bg-anime-primary/80 transition-all"
                      >
                        <Play className="w-5 h-5" /> Let&apos;s Watch!
                      </Link>
                      <button
                        onClick={respin}
                        disabled={isSpinning}
                        className="px-6 py-4 bg-[#212121] border border-[#2A2A2A] rounded-2xl text-white font-bold hover:bg-[#2A2A2A] transition-all"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto"
              >
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || filteredList.length === 0}
                  className="w-full py-16 bg-[#1A1A1A] border-2 border-dashed border-[#2A2A2A] rounded-[40px] hover:border-anime-primary transition-all group"
                >
                  {isSpinning ? (
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="w-16 h-16 text-anime-primary animate-spin" />
                      <span className="text-xl font-bold text-white">Spinning...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-anime-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Shuffle className="w-10 h-10 text-anime-primary" />
                      </div>
                      <span className="text-xl font-bold text-white">
                        {filteredList.length === 0 ? 'No anime match filter' : 'Spin the Wheel!'}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {filteredList.length} anime in your list
                      </span>
                    </div>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {history.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 text-center">
              Recent Spins
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {history.map((anime, index) => (
                <div
                  key={`${anime.id}-${index}`}
                  className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl"
                >
                  <div className="relative w-8 h-10 rounded overflow-hidden">
                    <Image src={anime.image} alt={anime.title} fill className="object-cover" />
                  </div>
                  <span className="text-sm text-white font-bold max-w-[100px] truncate">{anime.title}</span>
                  <button
                    onClick={() => removeFromHistory(anime)}
                    className="p-1 text-zinc-500 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
