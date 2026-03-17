'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Share2, Loader2, Play, Info, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { searchAnime } from '@/lib/api/anilist';
import { slugify } from '@/lib/utils/slugify';
import { useUserStore } from '@/store/userStore';
import { awardXp } from '@/lib/gamification/engine';

interface QuizOption {
  id: string;
  label: string;
  genres: string[];
  format?: 'TV' | 'MOVIE' | 'OVA';
  weights: Record<string, number>;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your vibe right now?",
    options: [
      { id: 'a', label: 'Dark & Intense', genres: ['Thriller', 'Psychological', 'Horror'], weights: { psychological: 3, horror: 2 } },
      { id: 'b', label: 'Feel Good & Wholesome', genres: ['Slice of Life', 'Comedy', 'Romance'], weights: { slice_of_life: 3, comedy: 2 } },
      { id: 'c', label: 'Action & Adventure', genres: ['Action', 'Adventure', 'Fantasy'], weights: { action: 3, adventure: 2 } },
      { id: 'd', label: 'Epic & Emotional', genres: ['Drama', 'Fantasy', 'Romance'], weights: { drama: 3, emotional: 2 } },
    ],
  },
  {
    id: 2,
    question: "Pick your ideal format",
    options: [
      { id: 'a', label: 'Standard TV Series', genres: [], format: 'TV', weights: {} },
      { id: 'b', label: 'Cinematic Movie', genres: [], format: 'MOVIE', weights: {} },
      { id: 'c', label: 'Short OVA / Special', genres: [], format: 'OVA', weights: {} },
      { id: 'd', label: "I'm open to anything!", genres: [], weights: {} },
    ],
  },
  {
    id: 3,
    question: "How do you want to feel after watching?",
    options: [
      { id: 'a', label: 'Satisfied & Complete', genres: ['Drama', 'Romance'], weights: { drama: 2 } },
      { id: 'b', label: 'Hyped & Energized', genres: ['Action', 'Sports'], weights: { action: 3 } },
      { id: 'c', label: 'Deeply Thoughtful', genres: ['Sci-Fi', 'Psychological'], weights: { psychological: 3, sci_fi: 2 } },
      { id: 'd', label: 'Warm & Fuzzy', genres: ['Comedy', 'Slice of Life'], weights: { comedy: 3 } },
    ],
  },
  {
    id: 4,
    question: "Pick an aesthetic",
    options: [
      { id: 'a', label: 'Modern Urban / Cyberpunk', genres: ['Sci-Fi', 'Thriller'], weights: { sci_fi: 3 } },
      { id: 'b', label: 'High Fantasy World', genres: ['Fantasy', 'Adventure'], weights: { fantasy: 3 } },
      { id: 'c', label: 'Cozy School Days', genres: ['Slice of Life', 'School'], weights: { slice_of_life: 3 } },
      { id: 'd', label: 'Gritty Historical', genres: ['Historical', 'Action'], weights: { historical: 3 } },
    ],
  },
  {
    id: 5,
    question: "Final choice: Level of Intensity?",
    options: [
      { id: 'a', label: 'Extreme! (High Stakes)', genres: ['Psychological', 'Action'], weights: { intensity: 3 } },
      { id: 'b', label: 'Moderate & Balanced', genres: [], weights: { intensity: 1 } },
      { id: 'c', label: 'Relaxed & Chill', genres: ['Slice of Life'], weights: { intensity: -2 } },
      { id: 'd', label: 'Pure Comedy Gold', genres: ['Comedy'], weights: { comedy: 3 } },
    ],
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [xpResult, setXpResult] = useState<any>(null);

  const { firebaseUser } = useUserStore();

  const handleAnswer = async (option: QuizOption) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setLoading(true);
      await generateResults(newAnswers);
    }
  };

  const generateResults = async (userAnswers: QuizOption[]) => {
    try {
      // 1. Tally genres and format
      const genreCounts: Record<string, number> = {};
      let preferredFormat: string | undefined = undefined;

      userAnswers.forEach(ans => {
        ans.genres.forEach(g => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
        if (ans.format) preferredFormat = ans.format;
      });

      // 2. Pick top genres
      const sortedGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(e => e[0]);

      // 3. Fetch from AniList
      const data = await searchAnime('', 1, {
        genre: sortedGenres.length > 0 ? sortedGenres : undefined,
        format: preferredFormat || undefined,
        sort: ['SCORE_DESC', 'POPULARITY_DESC']
      });

      const results = data?.Page?.media || [];
      setRecommendations(results.slice(0, 6));
      setShowResults(true);

      // 4. Award XP
      if (firebaseUser?.uid) {
        const res = await awardXp(firebaseUser.uid, 'TAKE_QUIZ');
        if (res) setXpResult(res);
      }
    } catch (error) {
      console.error("Quiz result generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setRecommendations([]);
    setXpResult(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] selection:bg-anime-primary/30 pt-28 pb-20">
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className="max-w-4xl mx-auto">
          
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={loading ? 'loading' : currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <Loader2 className="w-16 h-16 text-anime-primary animate-spin" />
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-heading font-black text-white uppercase tracking-tighter">Calculating your Anime DNA</h2>
                      <p className="text-zinc-500 text-sm font-bold">Scanning the archives for your perfect match...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel text-anime-primary font-black text-xs tracking-[0.2em] uppercase">
                          <Trophy className="w-4 h-4" /> Discovery Quiz
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight">
                          Finding your <span className="glow-text">next obsession</span>.
                        </h1>
                      </div>
                      <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 h-fit">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Progress</p>
                          <p className="text-xl font-black text-white tabular-nums">{currentQuestion + 1} / {questions.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                          <svg className="w-full h-full -rotate-90">
                            <circle
                              cx="24" cy="24" r="20"
                              fill="none" stroke="currentColor" strokeWidth="4"
                              className="text-white/5"
                            />
                            <circle
                              cx="24" cy="24" r="20"
                              fill="none" stroke="currentColor" strokeWidth="4"
                              strokeDasharray={125.6}
                              strokeDashoffset={125.6 - (125.6 * (currentQuestion + 1)) / questions.length}
                              className="text-anime-primary transition-all duration-500"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h2 className="text-2xl md:text-3xl font-heading font-bold text-white/90">
                        {questions[currentQuestion].question}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {questions[currentQuestion].options.map((option, index) => (
                          <button
                            key={option.id}
                            onClick={() => handleAnswer(option)}
                            className="relative p-8 rounded-[32px] glass-panel border-white/5 hover:border-anime-primary/50 transition-all group text-left overflow-hidden active:scale-95 shadow-xl"
                          >
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                              <Sparkles className="w-16 h-16 text-anime-primary" />
                            </div>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 text-xs font-black text-zinc-500 mb-4 group-hover:bg-anime-primary/20 group-hover:text-anime-primary transition-colors">
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="block text-xl font-black text-white group-hover:translate-x-1 transition-transform">
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-12"
              >
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-anime-primary/10 border border-anime-primary/20 text-anime-primary rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(157,78,221,0.2)]">
                    <Sparkles className="w-4 h-4 fill-current" /> Recommendation Result
                  </div>
                  <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight">
                    Your Perfect <span className="glow-text">Matches</span>
                  </h1>
                  
                  {xpResult && (
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-2xl text-xs font-bold"
                    >
                      <Zap className="w-4 h-4 fill-current" /> +{xpResult.xpGained} XP Earned! {xpResult.levelUp && 'LEVEL UP!'}
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={`/anime/${slugify(rec.title.english || rec.title.romaji)}-${rec.id}`}
                        className="group relative block aspect-[2/3] rounded-[32px] overflow-hidden glass-panel border-white/5 hover:border-anime-primary/50 transition-all shadow-2xl"
                      >
                        <Image
                          src={rec.coverImage.extraLarge || rec.coverImage.large}
                          alt={rec.title.english || rec.title.romaji}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-bg)] via-[var(--color-dark-bg)]/20 to-transparent" />
                        
                        <div className="absolute top-4 left-4 w-10 h-10 rounded-2xl glass-panel flex items-center justify-center text-white font-black text-sm z-10 border-white/10">
                          #{index + 1}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {rec.genres.slice(0, 2).map((g: string) => (
                              <span key={g} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-anime-primary/80 text-white rounded-lg backdrop-blur-md">
                                {g}
                              </span>
                            ))}
                          </div>
                          <h3 className="font-heading font-black text-white text-xl leading-tight group-hover:text-anime-primary transition-colors">
                            {rec.title.english || rec.title.romaji}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
                            <span>{rec.format}</span>
                            <span className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-yellow-400">★ {(rec.averageScore / 10).toFixed(1)}</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 justify-center items-center pt-8 border-t border-white/5">
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-3 px-10 py-5 rounded-[24px] glass-panel border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all shadow-xl active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5" /> Retake Quiz
                  </button>
                  <button
                    className="flex items-center gap-3 px-10 py-5 rounded-[24px] bg-anime-primary text-white font-black uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] transition-all shadow-xl active:scale-95"
                  >
                    <Share2 className="w-5 h-5" /> Share DNA
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
