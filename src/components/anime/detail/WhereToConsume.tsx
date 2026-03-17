'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ExternalLink, AlertTriangle, Shield, Zap, Download, Play, Youtube, Globe, Sparkles } from 'lucide-react';
import { UNOFFICIAL_SOURCES, AD_LEVEL_CONFIG, UnofficialSource } from '@/lib/utils/streamingLinks';
import { MAJOR_REGIONS, detectRegion } from '@/lib/utils/regionUtils';

interface WhereToConsumeProps {
  title: string;
  category: 'anime' | 'manga';
  legalSources?: { site: string; url: string; notes?: string }[];
  mediaId?: number; // Pass AniList ID to fetch mappings
}

function getFavicon(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (e) {
    return null;
  }
}

export function WhereToConsume({ title, category, legalSources = [], mediaId }: WhereToConsumeProps) {
  const [showUnofficial, setShowUnofficial] = useState(false);
  const [filter, setFilter] = useState<'all' | 'stream' | 'read' | 'download'>('all');

  // Disabled for AdSense compliance - only show official/legal sources
  // Unofficial sources hidden by default to avoid copyright issues

  const availabilityMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    MAJOR_REGIONS.forEach(r => map[r.code] = []);
    legalSources.forEach(src => {
      const regions = detectRegion(src.site, src.notes);
      regions.forEach(r => {
        if (map[r] && !map[r].includes(src.site)) map[r].push(src.site);
      });
    });
    return map;
  }, [legalSources]);

  const sourcesForCategory = UNOFFICIAL_SOURCES.filter(s => s.category === category);

  const filtered = sourcesForCategory.filter(s =>
    filter === 'all' ? true :
    filter === 'stream' ? s.type.includes('stream') :
    filter === 'read' ? s.type.includes('read') :
    ['ddl', 'torrent'].includes(s.type)
  );

  const themeColor = category === 'anime' ? 'text-anime-primary' : 'text-anime-secondary';

  return (
    <section className="space-y-10 animate-slide-up">
      
      {/* ── GLOBAL REGIONAL CHECKER ── */}
      <div className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 rounded-[40px] shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-full bg-anime-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-white">
            <Globe className="w-5 h-5 text-anime-primary" /> Global Regional Availability
          </h3>
          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest px-3 py-1 bg-[#212121] rounded-full border border-[#2A2A2A]">Auto-Detecting</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 relative z-10">
          {MAJOR_REGIONS.map(region => {
            const providers = availabilityMap[region.code] || [];
            const isAvailable = providers.length > 0;
            return (
              <div key={region.code} className={`flex flex-col items-center p-4 rounded-3xl border transition-all ${isAvailable ? 'bg-anime-primary/10 border-anime-primary/30 shadow-[0_0_20px_rgba(157,78,221,0.15)]' : 'bg-[#212121] border-[#2A2A2A] opacity-40'}`}>
                <span className="text-3xl mb-2 drop-shadow-md">{region.flag}</span>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter mb-1">{region.code}</span>
                <div className="flex flex-col items-center">
                  {isAvailable ? <span className="text-[8px] font-bold text-anime-accent uppercase tracking-widest text-center leading-tight">{providers[0]} {providers.length > 1 ? `+${providers.length - 1}` : ''}</span> : <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">N/A</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LEGAL SECTION ── */}
      <div>
        <h3 className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] mb-4 ${category === 'anime' ? 'text-green-400' : 'text-anime-secondary'}`}>
          <Shield className="w-4 h-4" /> OFFICIAL — Streaming Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {legalSources.map((src, i) => {
            const favicon = getFavicon(src.url);
            return (
              <a key={`${src.url}-${i}`} href={src.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-[#2A2A2A] bg-[#212121] hover:bg-white/10 transition-all group shadow-xl">
                <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden relative">
                  {favicon ? <img src={favicon} alt="" className="w-full h-full object-contain p-1 opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-[8px] font-black text-white/20">${src.site.slice(0, 2).toUpperCase()}</span>`; }} /> : <span className="text-[8px] font-black text-white/20">{src.site.slice(0, 2).toUpperCase()}</span>}
                </div>
                <span className="text-sm font-bold text-white/80 group-hover:text-white truncate">{src.site}</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
              </a>
            );
          })}
          {legalSources.length === 0 && <p className="text-sm text-zinc-500 col-span-full py-2">No regional providers detected. <a href={category === 'anime' ? "https://www.crunchyroll.com" : "https://www.viz.com"} target="_blank" className={`${themeColor} ml-1 hover:underline`}>Try {category === 'anime' ? 'Crunchyroll' : 'VIZ / Shonen Jump'} Global →</a></p>}
        </div>
      </div>

      {/* Download Button */}
      {category === 'anime' && (
        <Link 
          href={`/download?anime=${encodeURIComponent(title)}`}
          className="inline-flex items-center gap-2 bg-anime-primary text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] transition-all"
        >
          <Download className="w-5 h-5" />
          Download Episodes
        </Link>
      )}

      {/* ── UNOFFICIAL TOGGLE ── */}
      <div>
        <button onClick={() => setShowUnofficial(!showUnofficial)} className={`flex items-center gap-2 text-sm ${category === 'anime' ? 'text-yellow-500 hover:text-yellow-400' : 'text-purple-400 hover:text-purple-300'} hover:opacity-80 border border-zinc-800 rounded-xl px-5 py-3 transition-all font-bold group shadow-2xl`}>
          <AlertTriangle size={14} />
          {showUnofficial ? 'Hide Community Index' : 'Show Community Index'}
        </button>

        {showUnofficial && (
          <div className="mt-6 space-y-6 animate-slide-up">
            <div className={`p-4 rounded-2xl border text-xs italic ${category === 'anime' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300/70' : 'bg-purple-500/10 border-purple-500/20 text-purple-300/70'}`}>
              ⚠️ Community repositories — direct redirects enabled where possible.
            </div>

            <div className="flex gap-2">
              {(['all', category === 'anime' ? 'stream' : 'read', 'download'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? `${category === 'anime' ? 'bg-anime-primary shadow-[0_0_15px_rgba(157,78,221,0.4)]' : 'bg-anime-secondary shadow-[0_0_15px_rgba(90,24,154,0.4)]'} text-white` : 'border border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((source, i) => {
                const finalUrl = source.url(title);

                return (
                  <SourceCard 
                    key={`${source.name}-${i}`} 
                    source={source} 
                    url={finalUrl}
                    categoryColor={themeColor} 
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function SourceCard({ source, url, isLive, categoryColor }: { source: UnofficialSource; url: string; isLive?: boolean; categoryColor: string }) {
  const adConfig = AD_LEVEL_CONFIG[source.adLevel];
  const favicon = getFavicon(url);

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A]/30 hover:bg-[#212121] hover:border-[#2A2A2A] transition-all group shadow-xl relative overflow-hidden">
      {isLive && <div className="absolute top-0 right-0 px-2 py-0.5 bg-green-500/20 border-l border-b border-green-500/30 rounded-bl-lg text-[8px] font-black text-green-400 uppercase tracking-widest">Direct</div>}
      <div className="w-10 h-10 rounded-xl bg-[#212121] border border-[#2A2A2A] flex items-center justify-center text-white/20 shrink-0 group-hover:text-white transition-all overflow-hidden relative">
        {favicon ? <img src={favicon} alt="" className="w-full h-full object-contain p-1.5 opacity-60 group-hover:opacity-100 transition-opacity" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = `<div class="text-white/20"><Play size={14} /></div>`; }} /> : <Play size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm text-white group-hover:${categoryColor} transition-colors`}>{source.name}</span>
          <ExternalLink size={10} className="opacity-0 group-hover:opacity-60 transition-opacity text-zinc-400" />
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{source.quality}</span>
          <span className="w-1 h-1 bg-white/10 rounded-full" />
          <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${adConfig.bg} ${adConfig.color} border border-[#2A2A2A]`}>{adConfig.label}</span>
        </div>
        <p className="text-[10px] text-zinc-500 mt-2 line-clamp-1 italic group-hover:text-white/50 transition-colors">{source.note}</p>
      </div>
    </a>
  );
}
