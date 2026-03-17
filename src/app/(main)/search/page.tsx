'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchAnime, searchManga } from '@/lib/api/anilist';
import { MediaCard } from '@/components/shared/MediaCard';
import { Search as SearchIcon, Filter, AlertCircle, Loader2, Sparkles, BookOpen, Tv } from 'lucide-react';
import { AdUnit } from '@/components/ads/AdUnit';

const FORMATS = ['TV', 'MOVIE', 'OVA', 'ONA', 'MANGA'];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'anime';
  const initialFormat = searchParams.get('format') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(initialType);
  const [format, setFormat] = useState(initialFormat);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchResults = useCallback(async (isLoadMore: boolean = false) => {
    if (!query && !format) {
      setResults([]);
      return;
    }
    
    if (isLoadMore) setLoading(false);
    else setLoading(true);

    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const filters: any = {};
      if (format && format !== 'MANGA') filters.format = format;
      
      let data;
      if (type === 'manga' || format === 'MANGA') {
        data = await searchManga(query, currentPage, filters);
      } else {
        data = await searchAnime(query, currentPage, filters);
      }

      const newResults = data?.Page?.media || [];
      if (isLoadMore) {
        setResults(prev => [...prev, ...newResults]);
        setPage(currentPage);
      } else {
        setResults(newResults);
        setPage(1);
      }
      setHasNextPage(data?.Page?.pageInfo?.hasNextPage || false);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [query, type, format, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (type !== 'anime') params.set('type', type);
      if (format) params.set('format', format);
      router.replace(`/search?${params.toString()}`, { scroll: false });
    }, 500);
    return () => clearTimeout(timer);
  }, [query, type, format]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 sm:pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="w-full px-6 md:px-10 lg:px-12">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-8 sm:mb-10 md:mb-12 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-zinc-300 font-bold text-sm tracking-widest uppercase mb-6 backdrop-blur-xl">
              <SearchIcon className="w-4 h-4 text-anime-primary" />
              Global Search
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-black text-white mb-4 sm:mb-6 md:mb-8 leading-tight drop-shadow-xl">
              Find Your Next <span className="glow-text">Obsession</span>.
            </h1>

            <div className="relative max-w-3xl group">
              <div className="absolute -inset-0.5 bg-anime-primary/20 blur rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative flex items-center bg-[#1A1A1A] border border-[#2A2A2A] focus-within:border-anime-primary rounded-2xl shadow-2xl transition-all">
                <SearchIcon className="w-6 h-6 ml-6 text-zinc-500" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, character, or studio..."
                  className="w-full bg-transparent text-white text-lg py-6 pl-4 pr-8 outline-none placeholder:text-white/10 font-bold"
                />
                {loading && <Loader2 className="w-6 h-6 mr-6 text-anime-primary animate-spin" />}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-[#2A2A2A]">
                <button 
                  onClick={() => { setType('anime'); setFormat(''); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === 'anime' && format !== 'MANGA' ? 'bg-anime-primary text-white shadow-lg shadow-anime-primary/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  <Tv className="w-3.5 h-3.5" /> Anime
                </button>
                <button 
                  onClick={() => { setType('manga'); setFormat('MANGA'); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${type === 'manga' || format === 'MANGA' ? 'bg-anime-primary text-white shadow-lg shadow-anime-primary/20' : 'text-zinc-500 hover:text-white'}`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Manga
                </button>
              </div>

              <div className="h-6 w-px bg-white/5 mx-2 hidden sm:block" />

              <div className="flex flex-wrap gap-2">
                {FORMATS.filter(f => f !== 'MANGA').map(f => (
                  <button 
                    key={f} 
                    onClick={() => { setFormat(format === f ? '' : f); setType('anime'); }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all border ${format === f ? 'bg-anime-primary border-anime-primary text-white shadow-lg' : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => router.push('/discover')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase text-anime-accent bg-anime-accent/10 border border-anime-accent/20 hover:bg-anime-accent/20 transition-all ml-auto"
              >
                <Filter className="w-3.5 h-3.5" /> Advanced Discovery
              </button>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="space-y-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map((item: any, index: number) => (
                  <div key={item.id}>
                    <MediaCard
                      id={item.id}
                      title={item.title.english || item.title.romaji}
                      coverImage={item.coverImage.extraLarge || item.coverImage.large}
                      score={item.averageScore}
                      format={item.format}
                      episodes={item.episodes || item.chapters}
                      color={item.coverImage.color}
                      type={type === 'manga' || item.format === 'MANGA' ? 'manga' : 'anime'}
                    />
                    {(index + 1) % 12 === 0 && (
                      <div className="col-span-full py-8">
                        <AdUnit slot="search-results-ad" format="auto" className="min-h-[90px] rounded-3xl overflow-hidden" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center pb-12">
                  <button 
                    onClick={() => fetchResults(true)}
                    className="flex items-center gap-3 bg-white text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-anime-primary hover:text-white transition-all shadow-2xl"
                  >
                    <Sparkles className="w-4 h-4" /> Load More Results
                  </button>
                </div>
              )}
            </div>
          ) : query ? (
            !loading && (
              <div className="text-center py-40 border border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
                <AlertCircle className="w-16 h-16 text-white/10 mx-auto mb-6" />
                <h3 className="text-2xl font-heading font-black text-white/40 mb-2 uppercase tracking-tight">No Results Found</h3>
                <p className="text-white/20 text-sm">We couldn't find any content matching your search.</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
              <SearchIcon className="w-20 h-20 text-white/10 mb-6" />
              <h3 className="text-2xl font-heading font-black text-white/40 mb-2 uppercase tracking-tight">Search Hub</h3>
              <p className="text-white/20 text-sm max-w-xs mx-auto">Start typing above to discover millions of anime and manga titles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
