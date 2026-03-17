'use client';

import { useState, useEffect } from 'react';
import { getSeasonalAnime } from '@/lib/api/anilist';
import { MediaCard } from '@/components/shared/MediaCard';
import { Wind, Snowflake, Sun, Leaf, Calendar, Loader2 } from 'lucide-react';

const SEASONS = [
  { label: 'Winter', value: 'WINTER', icon: Snowflake, color: 'text-blue-400' },
  { label: 'Spring', value: 'SPRING', icon: Wind, color: 'text-green-400' },
  { label: 'Summer', value: 'SUMMER', icon: Sun, color: 'text-orange-400' },
  { label: 'Fall', value: 'FALL', icon: Leaf, color: 'text-red-400' }
];

export default function SeasonalPage() {
  const [animes, setAnimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get current season/year as default
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  let currentSeason = 'WINTER';
  if (currentMonth >= 2 && currentMonth <= 4) currentSeason = 'SPRING';
  else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = 'SUMMER';
  else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = 'FALL';

  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    const fetchSeasonal = async () => {
      setLoading(true);
      try {
        const data = await getSeasonalAnime(selectedSeason, selectedYear);
        setAnimes(data?.Page?.media || []);
      } catch (error) {
        console.error("Seasonal fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeasonal();
  }, [selectedSeason, selectedYear]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 md:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-[#2A2A2A] text-white/60 font-bold text-sm tracking-widest uppercase mb-6 backdrop-blur-xl">
            <Calendar className="w-4 h-4 text-anime-secondary" />
            Seasonal Archive
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black text-white mb-8 leading-tight drop-shadow-xl">
            Anime <span className="glow-text">Seasons</span>.
          </h1>

          {/* Season/Year Selectors */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex bg-[#1A1A1A] p-1.5 rounded-2xl border border-[#2A2A2A] overflow-x-auto scrollbar-hide">
              {SEASONS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSelectedSeason(s.value)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
                    selectedSeason === s.value 
                    ? 'bg-white text-black font-black shadow-xl' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <s.icon className={`w-4 h-4 ${selectedSeason === s.value ? 'text-black' : s.color}`} />
                  <span className="text-xs uppercase tracking-widest">{s.label}</span>
                </button>
              ))}
            </div>

            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-[#1A1A1A] border border-[#2A2A2A] text-white px-6 py-3 rounded-2xl outline-none font-black text-xs tracking-widest uppercase hover:border-anime-primary transition-all cursor-pointer"
            >
              {[...Array(11)].map((_, i) => (
                <option key={i} value={currentYear + 1 - i}>{currentYear + 1 - i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-anime-secondary animate-spin" />
            <p className="text-white/20 font-black uppercase tracking-widest text-xs">Curating the Season...</p>
          </div>
        ) : animes.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {animes.map((anime) => (
              <MediaCard
                key={anime.id}
                id={anime.id}
                title={anime.title.english || anime.title.romaji}
                coverImage={anime.coverImage.extraLarge || anime.coverImage.large}
                score={anime.averageScore}
                episodes={anime.episodes}
                color={anime.coverImage.color}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-white/[0.02] border border-dashed border-white/5 rounded-[40px]">
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">No Seasonal Data Found</p>
          </div>
        )}

      </div>
    </div>
  );
}
