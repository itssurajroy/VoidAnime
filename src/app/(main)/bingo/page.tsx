'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Share2, Download, Trophy, Sparkles } from 'lucide-react';

const SEASONAL_TROPES = [
  'Isekai Transported to Another World',
  'Beach Episode',
  'Training Arc',
  'Power of Friendship',
  'Unexpected Betrayal',
  'Season Finale Cliffhanger',
  'Amnesia Plot',
  'Love Triangle',
  'Hidden Power Reveal',
  'Rival Becomes Ally',
  'Flashback Episode',
  'Festival Episode',
  'Hot Springs Scene',
  'Character Returns from Dead',
  'Powerful New Enemy Appears',
  'Time Skip',
  'Dream Sequence',
  'Double Episode',
  'Mid-Season Finale',
  'Final Battle',
  'Episode 1 Hook',
  'Sneaky Peek Preview',
  'Villain Backstory',
  'Unexpected Alliance',
  'Main Character powers up',
];

const SEASONS = [
  { id: 'winter-2026', label: 'Winter 2026', year: 2026, season: 'Winter' },
  { id: 'spring-2026', label: 'Spring 2026', year: 2026, season: 'Spring' },
  { id: 'summer-2026', label: 'Summer 2026', year: 2026, season: 'Summer' },
  { id: 'fall-2026', label: 'Fall 2026', year: 2026, season: 'Fall' },
];

export default function BingoPage() {
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [markedCells, setMarkedCells] = useState<Set<number>>(new Set([12]));
  const [title, setTitle] = useState('Seasonal Anime Bingo');

  const shuffleArray = useCallback((array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const [bingoItems, setBingoItems] = useState(() => shuffleArray(SEASONAL_TROPES).slice(0, 25));

  const handleCellClick = (index: number) => {
    const newMarked = new Set(markedCells);
    if (newMarked.has(index)) {
      newMarked.delete(index);
    } else {
      newMarked.add(index);
    }
    setMarkedCells(newMarked);
  };

  const generateNewCard = () => {
    setBingoItems(shuffleArray(SEASONAL_TROPES).slice(0, 25));
    setMarkedCells(new Set([12]));
  };

  const checkForBingo = () => {
    const lines = [
      [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
      [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
      [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
    ];
    
    for (const line of lines) {
      if (line.every(idx => markedCells.has(idx))) {
        return true;
      }
    }
    return false;
  };

  const hasBingo = checkForBingo();

  return (
    <div className="min-h-screen bg-[#0D0D0D] selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span className="text-sm font-black uppercase tracking-widest text-zinc-500">Seasonal Challenge</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Anime Season Bingo
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Check off tropes as you watch this season. Get 5 in a row for BINGO!
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {SEASONS.map(season => (
            <button
              key={season.id}
              onClick={() => setSelectedSeason(season)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                selectedSeason.id === season.id
                  ? 'bg-anime-primary text-white'
                  : 'bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:text-white'
              }`}
            >
              {season.label}
            </button>
          ))}
        </div>

        {hasBingo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-500/20 border border-yellow-500/40 rounded-3xl">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-black text-yellow-500">BINGO!</span>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-5 gap-2 md:gap-4 mb-8">
          {bingoItems.map((item, index) => {
            const isMarked = markedCells.has(index);
            const isCenter = index === 12;
            
            return (
              <button
                key={`${selectedSeason.id}-${index}`}
                onClick={() => !isCenter && handleCellClick(index)}
                disabled={isCenter}
                className={`
                  aspect-square p-2 md:p-4 rounded-2xl font-bold text-xs md:text-sm transition-all
                  flex items-center justify-center text-center
                  ${isCenter 
                    ? 'bg-anime-primary/20 border-2 border-anime-primary cursor-default' 
                    : isMarked 
                      ? 'bg-anime-primary/30 border-2 border-anime-primary text-white' 
                      : 'bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:border-anime-primary hover:text-white'
                  }
                `}
              >
                {isCenter ? (
                  <span className="text-anime-primary font-black">FREE SPACE</span>
                ) : (
                  <span className="line-clamp-3">{item}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={generateNewCard}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white font-bold hover:bg-[#2A2A2A] transition-all"
          >
            <RefreshCw className="w-5 h-5" /> New Card
          </button>
          <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white font-bold hover:bg-[#2A2A2A] transition-all">
            <Share2 className="w-5 h-5" /> Share Card
          </button>
          <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-anime-primary text-white font-bold hover:bg-anime-primary/80 transition-all">
            <Download className="w-5 h-5" /> Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
