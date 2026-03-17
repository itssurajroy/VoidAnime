'use client';

import { ExternalLink, Database, ShoppingCart, Tv } from 'lucide-react';

interface ExternalTrackingLinksProps {
  id: number;
  malId?: number;
  siteUrl?: string;
  externalLinks?: { site: string; url: string; type?: string }[];
  title: string;
  type: 'anime' | 'manga';
}

export function ExternalTrackingLinks({ id, malId, siteUrl, externalLinks = [], title, type }: ExternalTrackingLinksProps) {
  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return null;
    }
  };

  const trackingSites = [
    { name: 'AniList', url: siteUrl || `https://anilist.co/${type}/${id}` },
    { name: 'MyAnimeList', url: malId ? `https://myanimelist.net/${type}/${malId}` : `https://myanimelist.net/${type}.php?q=${encodeURIComponent(title)}` },
    { name: 'Kitsu', url: `https://kitsu.io/${type}?filter[text]=${encodeURIComponent(title)}` },
  ];

  if (type === 'manga') {
    trackingSites.push({ name: 'MangaUpdates', url: `https://www.mangaupdates.com/search.html?search=${encodeURIComponent(title)}` });
  }

  // Filter for common buying/streaming sites
  const officialLinks = externalLinks.filter(link => {
    const site = link.site.toLowerCase();
    if (type === 'manga') {
      return site.includes('bookwalker') || site.includes('amazon') || site.includes('viz');
    } else {
      return site.includes('crunchyroll') || site.includes('netflix') || site.includes('hidive') || site.includes('disney');
    }
  });

  // Fallback for BookWalker if manga
  if (type === 'manga' && !officialLinks.some(l => l.site.toLowerCase().includes('bookwalker'))) {
    officialLinks.push({ 
      site: 'Book☆Walker', 
      url: `https://bookwalker.jp/search/?word=${encodeURIComponent(title)}` 
    });
  }

  return (
    <div className="space-y-6">
      {/* Official Section */}
      <div className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-6 rounded-[32px] shadow-2xl">
        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-anime-accent mb-4">
          {type === 'manga' ? <ShoppingCart className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
          {type === 'manga' ? 'Read or Buy (Official)' : 'Official Streaming'}
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {officialLinks.map((link, i) => (
            <a 
              key={i} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-[#212121] border border-[#2A2A2A] hover:bg-white/10 transition-all group"
            >
              <div className="w-6 h-6 rounded bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden relative">
                <img 
                  src={getFavicon(link.url) || ''} 
                  alt="" 
                  className="w-full h-full object-contain p-1"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              </div>
              <span className="text-sm font-bold text-white/80 group-hover:text-white truncate">{link.site}</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
          {officialLinks.length === 0 && (
            <p className="text-[10px] text-white/20 italic text-center py-2">No official links detected.</p>
          )}
        </div>
      </div>

      {/* Tracking Section */}
      <div className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-6 rounded-[32px] shadow-2xl">
        <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
          <Database className="w-3.5 h-3.5 text-anime-primary" /> Track & Database
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {trackingSites.map((site, i) => (
            <a 
              key={i} 
              href={site.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-[#212121] border border-[#2A2A2A] hover:bg-white/10 transition-all group"
            >
              <div className="w-5 h-5 rounded bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden">
                <img 
                  src={getFavicon(site.url) || ''} 
                  alt="" 
                  className="w-full h-full object-contain p-1" 
                />
              </div>
              <span className="text-[10px] font-black text-zinc-300 uppercase group-hover:text-white truncate">{site.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
