'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Download, Play, FileText, ChevronDown, Loader2, CheckCircle, XCircle, AlertCircle, Subtitles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  searchAnime,
  getAnimeEpisodes,
  getEpisodeServers,
  getStreamingLinks,
  formatDownloadFilename,
  AniwatchSearchResult,
  AniwatchEpisode,
  AniwatchServersResponse,
  AniwatchStreamingResponse,
  AniwatchSource
} from '@/lib/api/aniwatch';

type Language = 'sub' | 'dub' | 'raw';

interface ServerStatus {
  name: string;
  working: boolean;
  checking: boolean;
}

export default function DownloadPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AniwatchSearchResult[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<AniwatchSearchResult | null>(null);
  const [episodes, setEpisodes] = useState<AniwatchEpisode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<AniwatchEpisode | null>(null);
  const [language, setLanguage] = useState<Language>('sub');
  const [servers, setServers] = useState<AniwatchServersResponse['data'] | null>(null);
  const [selectedServer, setSelectedServer] = useState<string>('vidstreaming');
  const [serverStatus, setServerStatus] = useState<ServerStatus[]>([]);
  const [streamingData, setStreamingData] = useState<AniwatchStreamingResponse['data'] | null>(null);
  const [qualityOptions, setQualityOptions] = useState<string[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchAnime(searchQuery);
        if (data.success && data.data.animes) {
          setSearchResults(data.data.animes);
          setShowResults(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load episodes when anime selected
  useEffect(() => {
    if (!selectedAnime) return;

    async function loadEpisodes() {
      setIsLoading(true);
      try {
        const data = await getAnimeEpisodes(selectedAnime!.id);
        if (data.success && data.data.episodes) {
          setEpisodes(data.data.episodes.reverse());
        }
      } catch (err) {
        console.error('Episodes error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadEpisodes();
  }, [selectedAnime]);

  // Load servers when episode selected
  useEffect(() => {
    if (!selectedEpisode) return;

    async function loadServers() {
      if (!selectedEpisode) return;
      setIsLoading(true);
      setServerStatus([]);
      setStreamingData(null);
      try {
        const data = await getEpisodeServers(selectedEpisode.episodeId);
        if (data.success) {
          setServers(data.data);
          const serverList = data.data[language] || [];
          if (serverList.length > 0) {
            setSelectedServer(serverList[0].serverName);
            checkServers(serverList, selectedEpisode.episodeId, language);
          }
        }
      } catch (err) {
        console.error('Servers error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadServers();
  }, [selectedEpisode, language]);

  // Check server functionality
  const checkServers = async (serverList: { serverName: string }[], episodeId: string, lang: Language) => {
    const status: ServerStatus[] = serverList.map(s => ({ name: s.serverName, working: false, checking: true }));
    setServerStatus(status);

    for (let i = 0; i < serverList.length; i++) {
      const server = serverList[i];
      try {
        const data = await getStreamingLinks(episodeId, server.serverName, lang);
        if (data.success && data.data.sources?.length > 0) {
          status[i] = { name: server.serverName, working: true, checking: false };
          if (i === 0) {
            handleStreamingData(data.data, data.data.sources);
          }
        } else {
          status[i] = { name: server.serverName, working: false, checking: false };
        }
      } catch {
        status[i] = { name: server.serverName, working: false, checking: false };
      }
      setServerStatus([...status]);
    }
  };

  // Handle streaming data
  const handleStreamingData = (data: AniwatchStreamingResponse['data'], sources: AniwatchSource[]) => {
    setStreamingData(data);
    const qualities = sources.map(s => s.quality).filter(Boolean);
    const unique = [...new Set(qualities)];
    unique.sort((a, b) => parseInt(b.replace('p', '')) - parseInt(a.replace('p', '')));
    setQualityOptions(unique);
    if (unique.length > 0) {
      setSelectedQuality(unique[0]);
    }
  };

  // Load streaming when server selected
  useEffect(() => {
    if (!selectedEpisode || !selectedServer) return;

    async function loadStreaming() {
      if (!selectedEpisode) return;
      setIsLoading(true);
      setStreamingData(null);
      try {
        const data = await getStreamingLinks(selectedEpisode.episodeId, selectedServer, language);
        if (data.success && data.data.sources) {
          handleStreamingData(data.data, data.data.sources);
        }
      } catch (err) {
        console.error('Streaming error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStreaming();
  }, [selectedServer]);

  const getVideoUrl = () => {
    if (!streamingData?.sources || !selectedQuality) return null;
    const source = streamingData.sources.find(s => s.quality === selectedQuality);
    return source?.url || null;
  };

  const videoUrl = getVideoUrl();

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] pt-24 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-zinc-300 font-bold text-sm tracking-widest uppercase mb-4 backdrop-blur-xl">
            <Download className="w-4 h-4 text-anime-primary" />
            Download Center
          </div>
          <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">
            Download <span className="glow-text">Anime</span>
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Search for anime, select episode, choose quality and download
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search anime name..."
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:border-anime-primary outline-none transition-colors"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 animate-spin" />
            )}
          </div>

          {/* Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searchResults.map((anime) => (
                <button
                  key={anime.id}
                  onClick={() => {
                    setSelectedAnime(anime);
                    setSearchQuery(anime.name);
                    setShowResults(false);
                    setSelectedEpisode(null);
                    setEpisodes([]);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0">
                    <Image src={anime.poster} alt={anime.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{anime.name}</p>
                    <p className="text-zinc-500 text-sm">{anime.type} • {anime.episodes.sub} sub • {anime.episodes.dub} dub</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedAnime && (
          <div className="space-y-6">
            {/* Selected Anime Info */}
            <div className="flex items-center gap-4 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl">
              <div className="relative w-16 h-24 rounded-xl overflow-hidden shrink-0">
                <Image src={selectedAnime.poster} alt={selectedAnime.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{selectedAnime.name}</h2>
                <p className="text-zinc-400 text-sm">{selectedAnime.type} • {selectedAnime.duration}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {selectedAnime.episodes.sub} SUB • {selectedAnime.episodes.dub} DUB
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedAnime(null);
                  setSearchQuery('');
                  setEpisodes([]);
                  setSelectedEpisode(null);
                }}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <XCircle className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Episode Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Episode</label>
                <div className="relative">
                  <select
                    value={selectedEpisode?.episodeId || ''}
                    onChange={(e) => {
                      const ep = episodes.find(ep => ep.episodeId === e.target.value);
                      setSelectedEpisode(ep || null);
                    }}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:border-anime-primary outline-none"
                  >
                    <option value="">Select episode</option>
                    {episodes.map(ep => (
                      <option key={ep.episodeId} value={ep.episodeId}>
                        Episode {ep.number} {ep.title && `- ${ep.title}`} {ep.isFiller && '(Filler)'}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              {/* Language Toggle */}
              <div>
                <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Language</label>
                <div className="flex gap-2">
                  {(['sub', 'dub', 'raw'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      disabled={lang === 'dub' && !selectedAnime.episodes.dub}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                        language === lang
                          ? 'bg-anime-primary text-white'
                          : 'bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:text-white'
                      } ${lang === 'dub' && !selectedAnime.episodes.dub ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Server & Quality */}
            {selectedEpisode && serverStatus.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Server</label>
                  <div className="relative">
                    <select
                      value={selectedServer}
                      onChange={(e) => setSelectedServer(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:border-anime-primary outline-none"
                    >
                      {serverStatus.map(s => (
                        <option key={s.name} value={s.name}>
                          {s.name} {s.checking ? '(Checking...)' : s.working ? '(Working)' : '(Not working)'}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Quality</label>
                  <div className="relative">
                    <select
                      value={selectedQuality}
                      onChange={(e) => setSelectedQuality(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl py-3 px-4 text-white appearance-none cursor-pointer focus:border-anime-primary outline-none"
                    >
                      {qualityOptions.map(q => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Download Buttons */}
            {videoUrl && selectedEpisode && (
              <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`/api/stream?url=${encodeURIComponent(videoUrl)}&referer=${encodeURIComponent('https://hianime.to/')}&download=${encodeURIComponent(formatDownloadFilename(selectedAnime.name, selectedEpisode.number))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-anime-primary text-white py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] transition-all min-h-[52px]"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </a>

                  {streamingData?.subtitles && streamingData.subtitles.length > 0 && (
                    <a
                      href={`/api/proxy?url=${encodeURIComponent(streamingData.subtitles[0].file)}&referer=${encodeURIComponent('https://hianime.to/')}&download=${encodeURIComponent(formatDownloadFilename(selectedAnime.name, selectedEpisode.number) + '.vtt')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] text-white py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider hover:border-anime-accent/50 transition-all min-h-[52px]"
                    >
                      <Subtitles className="w-5 h-5" />
                      Download Subtitles ({streamingData.subtitles[0].label || 'Default'})
                    </a>
                  )}
                </div>

                {streamingData?.subtitles && streamingData.subtitles.length > 0 && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-200">
                        <p className="font-bold mb-1">Subtitle Notice</p>
                        <p>Download the .vtt file and use a media player like VLC to add subtitles. For browser playback, use an extension like "Language Learning with Netflix" or "Substital".</p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-center text-zinc-500 text-sm">
                  Filename: <span className="text-white font-mono">{formatDownloadFilename(selectedAnime.name, selectedEpisode.number)}.mp4</span>
                </p>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-anime-primary animate-spin" />
                <span className="ml-3 text-zinc-400">Loading...</span>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedAnime && (
          <div className="text-center py-16 border border-dashed border-[#2A2A2A] rounded-3xl">
            <Download className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-400 mb-2">Search for Anime</h3>
            <p className="text-zinc-500 text-sm">Enter an anime name above to start downloading</p>
          </div>
        )}
      </div>
    </div>
  );
}
