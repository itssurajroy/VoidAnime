'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchAnime } from '@/lib/api/anilist';
import { MediaCard } from '@/components/shared/MediaCard';
import { Filter, Tv, Sparkles, ChevronDown, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mahou Shoujo", 
  "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", 
  "Sports", "Supernatural", "Thriller"
];

const FORMATS = [
  { label: 'TV', value: 'TV' },
  { label: 'Movie', value: 'MOVIE' },
  { label: 'OVA', value: 'OVA' },
  { label: 'ONA', value: 'ONA' },
  { label: 'Special', value: 'SPECIAL' }
];

const STATUSES = [
  { label: 'Finished', value: 'FINISHED' },
  { label: 'Airing', value: 'RELEASING' },
  { label: 'Not Yet Released', value: 'NOT_YET_RELEASED' },
  { label: 'Cancelled', value: 'CANCELLED' }
];

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'POPULARITY_DESC' },
  { label: 'Score', value: 'SCORE_DESC' },
  { label: 'Trending', value: 'TRENDING_DESC' },
  { label: 'Newest', value: 'START_DATE_DESC' }
];

export default function DiscoverPage() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [format, setFormat] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState('POPULARITY_DESC');
  const [showFilters, setShowFilters] = useState(false);

  const fetchResults = useCallback(async (isLoadMore: boolean = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const filters: any = {
        sort: [sort],
        genre: selectedGenres.length > 0 ? selectedGenres : undefined,
        year: year || undefined,
        format: format || undefined,
        status: status || undefined
      };

      const data = await searchAnime(search, currentPage, filters);
      const results = data?.Page?.media || [];
      
      if (isLoadMore) {
        setAnimes(prev => [...prev, ...results]);
        setPage(currentPage);
      } else {
        setAnimes(results);
        setPage(1);
      }
      
      setHasNextPage(data?.Page?.pageInfo?.hasNextPage || false);
    } catch (error) {
      console.error("Discovery error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [search, selectedGenres, year, format, status, sort, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, selectedGenres, year, format, status, sort]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 sm:pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className="max-w-[1920px] mx-auto">
        
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12 animate-slide-up">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-[#2A2A2A] text-white/60 font-bold text-sm tracking-widest uppercase mb-4 backdrop-blur-xl">
                <Tv className="w-4 h-4 text-anime-primary" />
                Advanced Discovery
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-black text-white leading-tight drop-shadow-xl">
                Browse <span className="glow-text">Anime</span>.
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-anime-primary/20 blur rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl flex items-center px-4 py-3 w-full md:w-80 shadow-2xl">
                  <Search className="w-5 h-5 text-white/30 mr-3" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter by title..."
                    className="bg-transparent text-white outline-none w-full placeholder:text-white/10 font-bold"
                  />
                </div>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-center shadow-xl ${
                  showFilters || selectedGenres.length > 0 || year || format || status
                  ? 'bg-anime-primary border-anime-primary text-white' 
                  : 'bg-white/5 border-[#2A2A2A] text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-12"
              >
                <div className="bg-[#14111A] border border-[#2A2A2A] rounded-[32px] p-8 shadow-2xl space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Sort */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Sort By</label>
                      <div className="grid grid-cols-2 gap-2">
                        {SORT_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setSort(opt.value)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                              sort === opt.value 
                              ? 'bg-anime-primary border-anime-primary text-white shadow-lg shadow-anime-primary/20' 
                              : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Format */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Format</label>
                      <div className="grid grid-cols-2 gap-2">
                        {FORMATS.map(f => (
                          <button
                            key={f.value}
                            onClick={() => setFormat(format === f.value ? undefined : f.value)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                              format === f.value 
                              ? 'bg-anime-primary border-anime-primary text-white shadow-lg shadow-anime-primary/20' 
                              : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Status</label>
                      <div className="grid grid-cols-2 gap-2">
                        {STATUSES.map(s => (
                          <button
                            key={s.value}
                            onClick={() => setStatus(status === s.value ? undefined : s.value)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                              status === s.value 
                              ? 'bg-anime-primary border-anime-primary text-white shadow-lg shadow-anime-primary/20' 
                              : 'bg-black/20 border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Year */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Release Year</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          placeholder="e.g. 2024"
                          value={year || ''}
                          onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 px-4 text-sm text-white focus:border-anime-primary outline-none transition-all"
                        />
                        <Tv className="absolute right-4 top-2.5 w-4 h-4 text-white/20" />
                      </div>
                      <div className="flex gap-2">
                        {[2025, 2024, 2023].map(y => (
                          <button 
                            key={y}
                            onClick={() => setYear(y)}
                            className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-white/40 hover:text-white transition-all"
                          >
                            {y}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Genres */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Genre Filter</label>
                    <div className="flex flex-wrap gap-2">
                      {GENRES.map(genre => (
                        <button
                          key={genre}
                          onClick={() => toggleGenre(genre)}
                          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                            selectedGenres.includes(genre)
                            ? 'bg-anime-primary/20 border-anime-primary text-anime-primary' 
                            : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear All */}
                  <div className="flex justify-end">
                    <button 
                      onClick={() => {
                        setSelectedGenres([]);
                        setYear(undefined);
                        setFormat(undefined);
                        setStatus(undefined);
                        setSort('POPULARITY_DESC');
                        setSearch('');
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 text-anime-primary animate-spin" />
              <p className="text-white/20 font-black uppercase tracking-widest text-xs">Scanning the Database...</p>
            </div>
          ) : animes.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {animes.map((anime) => (
                  <MediaCard
                    key={anime.id}
                    id={anime.id}
                    title={anime.title.english || anime.title.romaji}
                    coverImage={anime.coverImage.extraLarge || anime.coverImage.large}
                    score={anime.averageScore}
                    format={anime.format}
                    episodes={anime.episodes}
                    color={anime.coverImage.color}
                  />
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center pb-12">
                  <button 
                    onClick={() => fetchResults(true)}
                    disabled={loadingMore}
                    className="flex items-center gap-3 bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-anime-primary hover:text-white transition-all shadow-2xl disabled:opacity-50"
                  >
                    {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loadingMore ? 'Loading...' : 'Load More Discoveries'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-40 border border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
              <Search className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-2xl font-heading font-black text-white/40 mb-2 uppercase tracking-tight">No Matches Found</h3>
              <p className="text-white/20 text-sm max-w-xs mx-auto">Try adjusting your filters or keyword to find what you're looking for.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
