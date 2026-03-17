// src/lib/utils/streamingLinks.ts

export interface UnofficialSource {
  name: string;
  url: (title: string) => string;
  watchUrl?: (id: string) => string; 
  providerKey?: string; 
  icon: string;
  type: string;
  category: string;
  quality: string;
  adLevel: 'none' | 'low' | 'moderate' | 'high';
  subDub: string;
  recommended: boolean;
  note: string;
}

export const UNOFFICIAL_SOURCES: UnofficialSource[] = [
  // 🎬 STREAM SITES (Anime - Top Picks from Everythingmoe)
  {
    name: 'HiAnime',
    url: (title: string) => `https://hianime.to/search?keyword=${encodeURIComponent(title)}`,
    watchUrl: (id: string) => `https://hianime.to/watch/${id}`,
    providerKey: 'zoro',
    icon: '/icons/hianime.png',
    type: 'stream',
    category: 'anime',
    quality: '1080p',
    adLevel: 'low',
    subDub: 'Sub+Dub',
    recommended: true,
    note: 'Premium UI, auto-next, skip intro features',
  },
  {
    name: 'Miruro',
    url: (title: string) => `https://www.miruro.tv/search?query=${encodeURIComponent(title)}`,
    icon: '/icons/miruro.png',
    type: 'stream',
    category: 'anime',
    quality: '1080p',
    adLevel: 'none',
    subDub: 'Sub+Dub',
    recommended: true,
    note: 'No ads, clean modern design, high performance',
  },
  {
    name: 'Animepahe',
    url: (title: string) => `https://animepahe.ru/search?q=${encodeURIComponent(title)}`,
    watchUrl: (id: string) => `https://animepahe.ru/anime/${id}`,
    providerKey: 'animepahe',
    icon: '/icons/animepahe.png',
    type: 'stream',
    category: 'anime',
    quality: '720p-1080p',
    adLevel: 'low',
    subDub: 'Sub',
    recommended: true,
    note: 'Legendary efficiency, small files, great quality',
  },
  {
    name: 'Kaido',
    url: (title: string) => `https://kaido.to/search?keyword=${encodeURIComponent(title)}`,
    watchUrl: (id: string) => `https://kaido.to/watch/${id}`,
    providerKey: 'zoro',
    icon: '/icons/kaido.png',
    type: 'stream',
    category: 'anime',
    quality: '1080p',
    adLevel: 'low',
    subDub: 'Sub+Dub',
    recommended: true,
    note: 'Fast servers, Zoro-style UI but cleaner',
  },
  {
    name: 'Gogoanime',
    url: (title: string) => `https://gogoanime.hu/search.html?keyword=${encodeURIComponent(title)}`,
    watchUrl: (id: string) => `https://gogoanime.hu/category/${id}`,
    providerKey: 'gogoanime',
    icon: '/icons/gogoanime.png',
    type: 'stream',
    category: 'anime',
    quality: '1080p',
    adLevel: 'high',
    subDub: 'Sub+Dub',
    recommended: false,
    note: 'The largest archive in existence, heavy ads',
  },
  {
    name: 'Kickassanime',
    url: (title: string) => `https://kickassanime.am/search?q=${encodeURIComponent(title)}`,
    icon: '/icons/kaa.png',
    type: 'stream',
    category: 'anime',
    quality: '4K/1080p',
    adLevel: 'low',
    subDub: 'Sub+Dub',
    recommended: true,
    note: 'Superior video quality, select titles in 4K',
  },

  // ⬇️ DOWNLOAD / TORRENT SITES (Anime)
  {
    name: 'Nyaa.si',
    url: (title: string) => `https://nyaa.si/?q=${encodeURIComponent(title)}&c=1_2&f=0`,
    icon: '/icons/nyaa.png',
    type: 'torrent',
    category: 'anime',
    quality: 'BD/4K/Raw',
    adLevel: 'none',
    subDub: 'Sub+Dub+Raw',
    recommended: true,
    note: 'The gold standard for high-quality releases',
  },
  {
    name: 'AnimeOut',
    url: (title: string) => `https://www.animeout.xyz/?s=${encodeURIComponent(title)}`,
    icon: '/icons/animeout.png',
    type: 'ddl',
    category: 'anime',
    quality: '720p/1080p',
    adLevel: 'low',
    subDub: 'Sub',
    recommended: false,
    note: 'Direct Google Drive links for low data usage',
  },

  // 📖 MANGA SITES (Top Picks from Everythingmoe)
  {
    name: 'MangaDex',
    url: (title: string) => `https://mangadex.org/search?q=${encodeURIComponent(title)}`,
    icon: '/icons/mangadex.png',
    type: 'read',
    category: 'manga',
    quality: 'High Res',
    adLevel: 'none',
    subDub: 'Multi-Language',
    recommended: true,
    note: 'Best community reader, ad-free, high res scans',
  },
  {
    name: 'MangaFire',
    url: (title: string) => `https://mangafire.to/filter?keyword=${encodeURIComponent(title)}`,
    icon: '/icons/mangafire.png',
    type: 'read',
    category: 'manga',
    quality: 'Digital HD',
    adLevel: 'low',
    subDub: 'English',
    recommended: true,
    note: 'Fast modern interface, smart reading modes',
  },
  {
    name: 'Comick',
    url: (title: string) => `https://comick.io/search?q=${encodeURIComponent(title)}`,
    icon: '/icons/comick.png',
    type: 'read',
    category: 'manga',
    quality: 'HD',
    adLevel: 'none',
    subDub: 'Multi-Language',
    recommended: true,
    note: 'Incredible aggregator, no ads, beautiful UI',
  },
  {
    name: 'MangaSee',
    url: (title: string) => `https://mangasee123.com/search/?keyword=${encodeURIComponent(title)}`,
    icon: '/icons/mangasee.png',
    type: 'read',
    category: 'manga',
    quality: 'Official Scans',
    adLevel: 'moderate',
    subDub: 'English',
    recommended: true,
    note: 'Reliable source for high-quality official scans',
  },
  {
    name: 'Bato.to',
    url: (title: string) => `https://bato.to/search?word=${encodeURIComponent(title)}`,
    icon: '/icons/bato.png',
    type: 'read',
    category: 'manga',
    quality: 'HD',
    adLevel: 'low',
    subDub: 'English',
    recommended: false,
    note: 'Great for manhwa and romance titles',
  },
  {
    name: 'MangaReader',
    url: (title: string) => `https://mangareader.to/search?keyword=${encodeURIComponent(title)}`,
    icon: '/icons/mangareader.png',
    type: 'read',
    category: 'manga',
    quality: 'HD',
    adLevel: 'low',
    subDub: 'Multi-Language',
    recommended: false,
    note: 'Classic interface, good horizontal reading mode',
  },
];

export const AD_LEVEL_CONFIG: Record<string, { label: string, color: string, bg: string }> = {
  none:     { label: 'No Ads',       color: 'text-green-400',  bg: 'bg-green-400/10' },
  low:      { label: 'Low Ads',      color: 'text-blue-400',   bg: 'bg-blue-400/10'  },
  moderate: { label: 'Moderate Ads', color: 'text-yellow-400', bg: 'bg-yellow-400/10'},
  high:     { label: 'Heavy Ads',    color: 'text-red-400',    bg: 'bg-red-400/10'   },
};
