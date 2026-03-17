'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, ChevronDown, ChevronUp, SlidersHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { getHomeData } from '@/services/anime';
import { cn } from '@/lib/utils';

interface FilterState {
  type: string;
  status: string;
  rated: string;
  score: string;
  season: string;
  language: string;
  sort: string;
  genres: string[];
  startDate: string;
  endDate: string;
}

interface AdvancedFiltersProps {
  initialFilters?: Partial<FilterState>;
  onApply?: (filters: FilterState) => void;
}

const TYPE_OPTIONS = [
  { value: 'movie', label: 'Movie' },
  { value: 'tv', label: 'TV' },
  { value: 'ova', label: 'OVA' },
  { value: 'special', label: 'Special' },
  { value: 'ona', label: 'ONA' },
  { value: 'music', label: 'Music' },
];

const STATUS_OPTIONS = [
  { value: 'finished-airing', label: 'Finished Airing' },
  { value: 'currently-airing', label: 'Currently Airing' },
  { value: 'not-yet-aired', label: 'Not Yet Aired' },
];

const RATED_OPTIONS = [
  { value: 'g', label: 'G - All Ages' },
  { value: 'pg', label: 'PG - Children' },
  { value: 'pg-13', label: 'PG-13 - Teens 13+' },
  { value: 'r', label: 'R - Adults 17+' },
  { value: 'r+', label: 'R+ - Adults 18+' },
  { value: 'rx', label: 'Rx - Hentai' },
];

const SCORE_OPTIONS = [
  { value: 'excellent', label: 'Excellent (9+)' },
  { value: 'very-good', label: 'Very Good (8+)' },
  { value: 'good', label: 'Good (7+)' },
  { value: 'fair', label: 'Fair (6+)' },
  { value: 'average', label: 'Average (5+)' },
];

const SEASON_OPTIONS = [
  { value: 'winter', label: 'Winter' },
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
];

const LANGUAGE_OPTIONS = [
  { value: 'sub', label: 'Subbed' },
  { value: 'dub', label: 'Dubbed' },
  { value: 'sub-&-dub', label: 'Sub & Dub' },
];

const SORT_OPTIONS = [
  { value: 'recently-added', label: 'Recently Added' },
  { value: 'recently-updated', label: 'Recently Updated' },
  { value: 'score', label: 'Score' },
  { value: 'name', label: 'Name' },
  { value: 'released-date', label: 'Released Date' },
  { value: 'most-watched', label: 'Most Watched' },
];

export function AdvancedFilters({ initialFilters, onApply }: AdvancedFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    type: initialFilters?.type || '',
    status: initialFilters?.status || '',
    rated: initialFilters?.rated || '',
    score: initialFilters?.score || '',
    season: initialFilters?.season || '',
    language: initialFilters?.language || '',
    sort: initialFilters?.sort || 'recently-added',
    genres: initialFilters?.genres || [],
    startDate: initialFilters?.startDate || '',
    endDate: initialFilters?.endDate || '',
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await getHomeData();
        if (data.genres) {
          setGenres(data.genres);
        }
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setLoadingGenres(false);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const rated = searchParams.get('rated');
    const score = searchParams.get('score');
    const season = searchParams.get('season');
    const language = searchParams.get('language');
    const sort = searchParams.get('sort');
    const genresParam = searchParams.get('genres');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    setFilters(prev => ({
      ...prev,
      type: type || '',
      status: status || '',
      rated: rated || '',
      score: score || '',
      season: season || '',
      language: language || '',
      sort: sort || 'recently-added',
      genres: genresParam ? genresParam.split(',') : [],
      startDate: startDate || '',
      endDate: endDate || '',
    }));
  }, [searchParams]);

  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    const query = searchParams.get('q');
    if (query) params.set('q', query);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'genres' && Array.isArray(value) && value.length > 0) {
        params.set('genres', value.join(','));
      } else if (key === 'sort' && value !== 'recently-added') {
        params.set('sort', value);
      } else if (value && value !== '' && key !== 'sort') {
        const paramKey = key === 'startDate' ? 'start_date' : key === 'endDate' ? 'end_date' : key;
        params.set(paramKey, value as string);
      }
    });

    router.push(`/search?${params.toString()}`);
    setIsOpen(false);
    onApply?.(filters);
  };

  const clearFilters = () => {
    const query = searchParams.get('q');
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/search');
    }
    setFilters({
      type: '',
      status: '',
      rated: '',
      score: '',
      season: '',
      language: '',
      sort: 'recently-added',
      genres: [],
      startDate: '',
      endDate: '',
    });
    setIsOpen(false);
  };

  const activeFilterCount = [
    filters.type,
    filters.status,
    filters.rated,
    filters.score,
    filters.season,
    filters.language,
    filters.startDate,
    filters.endDate,
    ...filters.genres,
  ].filter(Boolean).length;

  const [genreQuery, setGenreQuery] = useState('');

  const filteredGenresList = genres.filter(g => 
    g.toLowerCase().includes(genreQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <CollapsibleTrigger asChild>
            <Button className={cn(
                "group/filters gap-3 transition-all duration-500 rounded-2xl h-12 px-6 shadow-2xl relative overflow-hidden",
                isOpen 
                  ? "bg-primary text-black hover:bg-primary/90" 
                  : "bg-white/5 text-white hover:bg-white/10 hover:border-white/20 border border-white/5"
            )}>
              <SlidersHorizontal className={cn("w-4 h-4 transition-transform duration-500", isOpen && "rotate-90")} />
              <span className="font-black uppercase tracking-widest text-[12px]">Advanced Filters</span>
              {activeFilterCount > 0 && (
                <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-black/20 text-inherit text-[10px] font-black">
                  {activeFilterCount}
                </div>
              )}
              <div className="flex items-center ml-2 border-l border-current/20 pl-3">
                 {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </Button>
          </CollapsibleTrigger>

          <div className="flex flex-wrap items-center gap-2">
             {['Movie', 'TV', 'Dubbed', 'Score 8+'].map((chip) => (
                <button 
                  key={chip}
                  onClick={() => {
                     if (chip === 'Movie') updateFilter('type', 'movie');
                     if (chip === 'TV') updateFilter('type', 'tv');
                     if (chip === 'Dubbed') updateFilter('language', 'dub');
                     if (chip === 'Score 8+') updateFilter('score', 'very-good');
                     applyFilters();
                  }}
                  className="h-9 px-4 rounded-full bg-white/5 border border-white/5 text-white/40 text-[11px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white hover:border-white/20 transition-all active:scale-95"
                >
                   {chip}
                </button>
             ))}
          </div>

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto text-white/30 hover:text-red-400 hover:bg-red-400/5 rounded-full px-5 h-10 text-[11px] font-black uppercase tracking-[0.2em] transition-all">
              PURGE FILTERS
            </Button>
          )}
        </div>

        <CollapsibleContent className="animate-in slide-in-from-top-4 fade-in-0 duration-500 ease-out">
          <div className="relative p-6 sm:p-8 bg-card border border-white/10 rounded-[24px] sm:rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] mb-12 overflow-hidden group/panel">
            {/* Animated Background Aura */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover/panel:bg-primary/10 transition-all duration-1000" />
            
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-8 sm:gap-y-10">
              {/* Sort */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-white/40 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ml-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   Sort Sequence
                </Label>
                <Select value={filters.sort} onValueChange={(v) => updateFilter('sort', v)}>
                  <SelectTrigger className="bg-white/5 border border-white/5 hover:border-white/20 text-white h-11 sm:h-12 rounded-xl font-bold focus:ring-primary/20 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10 text-white shadow-2xl rounded-xl">
                    {SORT_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-primary/20 focus:text-primary cursor-pointer font-bold text-xs sm:text-sm">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Type */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-white/40 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ml-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                   Media Format
                </Label>
                <Select value={filters.type} onValueChange={(v) => updateFilter('type', v)}>
                  <SelectTrigger className="bg-white/5 border border-white/5 hover:border-white/20 text-white h-11 sm:h-12 rounded-xl font-bold focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10 text-white shadow-2xl rounded-xl">
                    {TYPE_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-primary/20 focus:text-primary cursor-pointer font-bold text-xs sm:text-sm">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-white/40 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ml-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   Release State
                </Label>
                <Select value={filters.status} onValueChange={(v) => updateFilter('status', v)}>
                  <SelectTrigger className="bg-white/5 border border-white/5 hover:border-white/20 text-white h-11 sm:h-12 rounded-xl font-bold focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Any State" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10 text-white shadow-2xl rounded-xl">
                    {STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-primary/20 focus:text-primary cursor-pointer font-bold text-xs sm:text-sm">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Score */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2 text-white/40 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] ml-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                   Rating Filter
                </Label>
                <Select value={filters.score} onValueChange={(v) => updateFilter('score', v)}>
                  <SelectTrigger className="bg-white/5 border border-white/5 hover:border-white/20 text-white h-11 sm:h-12 rounded-xl font-bold focus:ring-primary/20 transition-all">
                    <SelectValue placeholder="Any Threshold" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10 text-white shadow-2xl rounded-xl">
                    {SCORE_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="focus:bg-primary/20 focus:text-primary cursor-pointer font-bold text-xs sm:text-sm">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Genres Hub */}
              <div className="col-span-full space-y-6 pt-6 border-t border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <Label className="flex items-center gap-2 text-white/40 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] ml-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Popular Genres: {loadingGenres ? 'LOADING...' : 'ACTIVE'}
                   </Label>
                   
                   <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                      <Input 
                        placeholder="Search genres..."
                        className="h-9 sm:h-8 bg-white/5 border border-white/5 rounded-full pl-9 text-[11px] sm:text-[12px] font-bold focus:ring-primary/20 placeholder:text-white/10 transition-all"
                        value={genreQuery}
                        onChange={(e) => setGenreQuery(e.target.value)}
                      />
                   </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-2.5 max-h-40 overflow-y-auto p-1 sm:p-2 group/scroll custom-scrollbar pr-4">
                  {filteredGenresList.map(genre => {
                    const isActive = filters.genres.includes(genre.toLowerCase());
                    return (
                      <button
                        key={genre}
                        className={cn(
                          "text-[9px] sm:text-[11px] font-black uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 border active:scale-95",
                          isActive 
                            ? "bg-primary border-primary text-black shadow-lg shadow-primary/30" 
                            : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white hover:border-white/20"
                        )}
                        onClick={() => toggleGenre(genre.toLowerCase())}
                      >
                        {genre}
                      </button>
                    );
                  })}
                  
                  {filteredGenresList.length === 0 && (
                     <div className="w-full text-center py-4 text-white/20 text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                        No genres matching tag: "{genreQuery}"
                     </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-6 mt-4 pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-white/20 font-black uppercase tracking-[0.3em] text-center sm:text-left">
                   System Status: Online
                </div>
                <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                  <Button variant="ghost" onClick={clearFilters} className="flex-1 sm:flex-none text-white/40 hover:text-white hover:bg-white/5 rounded-xl sm:rounded-2xl px-6 sm:px-8 font-black text-[11px] sm:text-[12px] uppercase tracking-widest h-11 sm:h-12">
                    Reset
                  </Button>
                  <Button onClick={applyFilters} className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-black font-black px-8 sm:px-12 h-11 sm:h-12 rounded-xl sm:rounded-2xl shadow-2xl shadow-primary/30 border-none transition-all hover:scale-[1.03] active:scale-95 uppercase tracking-[0.15em] text-[11px] sm:text-[12px]">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
