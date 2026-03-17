'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
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

  // Handle anime query parameter from URL
  useEffect(() => {
    const animeParam = searchParams.get('anime');
    if (animeParam && !searchQuery) {
      setSearchQuery(animeParam);
    }
  }, [searchParams, searchQuery]);

  // Auto-search when anime param is set
  useEffect(() => {
    const animeParam = searchParams.get('anime');
    if (animeParam && animeParam === searchQuery && searchQuery.trim()) {
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
    }
  }, [searchQuery, searchParams]);

  // Load episodes when anime selected
  useEffect(() => {
    if (!selectedAnime) return;

    async function loadEpisodes() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAnimeEpisodes(selectedAnime!.id);
        if (data.success && data.data.episodes) {
          setEpisodes(data.data.episodes.reverse());
        } else {
          setError('Failed to load episodes');
        }
      } catch (err) {
        console.error('Episodes error:', err);
        setError('Failed to load episodes');
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
      setError(null);
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
          } else {
            setError('No servers available for this episode');
          }
        } else {
          setError('Failed to load servers');
        }
      } catch (err) {
        console.error('Servers error:', err);
        setError('Failed to load servers');
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
    setError(null);

    let hasWorkingServer = false;

    for (let i = 0; i < serverList.length; i++) {
      const server = serverList[i];
      try {
        const data = await getStreamingLinks(episodeId, server.serverName, lang);
        if (data.success && data.data.sources?.length > 0) {
          status[i] = { name: server.serverName, working: true, checking: false };
          hasWorkingServer = true;
          if (i === 0) {
            handleStreamingData(data.data, data.data.sources);
          }
        } else {
          status[i] = { name: server.serverName, working: false, checking: false };
          console.log(`Server ${server.serverName} failed`);
        }
      } catch (err) {
        status[i] = { name: server.serverName, working: false, checking: false };
        console.error(`Server ${server.serverName} error:`, err);
      }
      setServerStatus([...status]);
    }

    if (!hasWorkingServer) {
      setError('All servers failed to load. The external API may be experiencing issues or this episode may not be available.');
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
      setError(null);
      try {
        const data = await getStreamingLinks(selectedEpisode.episodeId, selectedServer, language);
        if (data.success && data.data.sources && data.data.sources.length > 0) {
          handleStreamingData(data.data, data.data.sources);
        } else {
          setError(`No streaming sources found for ${selectedServer}. Try a different server.`);
        }
      } catch (err) {
        console.error('Streaming error:', err);
        setError('Failed to load streaming sources. The external API may be experiencing issues.');
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
          {searchParams.get('anime') && (
            <p className="text-anime-primary font-bold mb-2">
              Ready to download: {searchParams.get('anime')}
            </p>
          )}
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

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-400 text-sm font-bold mb-2">{error}</p>
                    <div className="text-xs text-red-300/70 space-y-1">
                      <p>This issue is usually caused by:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>The streaming server is temporarily unavailable</li>
                        <li>The episode ID format has changed</li>
                        <li>Network issues with the external API</li>
                      </ul>
                      <p className="mt-2">Try:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Selecting a different episode</li>
                        <li>Choosing a different server (vidstreaming, megacloud, etc.)</li>
                        <li>Trying again in a few minutes</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API Status Banner */}
            <div className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl mb-6">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-zinc-400">External API: void-ivory-beta.vercel.app</span>
                </div>
                <span className="text-zinc-500">Streaming sources may be unavailable</span>
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
            {videoUrl && selectedEpisode && streamingData && (
              <div className="space-y-4 pt-4 border-t border-[#2A2A2A]">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`/api/stream?url=${encodeURIComponent(videoUrl)}&referer=${encodeURIComponent(streamingData.headers?.Referer || 'https://hianime.to/')}&download=${encodeURIComponent(formatDownloadFilename(selectedAnime.name, selectedEpisode.number))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => console.log('Download URL:', `/api/stream?url=${encodeURIComponent(videoUrl)}&referer=${encodeURIComponent(streamingData.headers?.Referer || 'https://hianime.to/')}&download=...`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-anime-primary text-white py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] transition-all min-h-[52px]"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </a>

                  {streamingData?.subtitles && streamingData.subtitles.length > 0 && (
                    <a
                      href={`/api/proxy?url=${encodeURIComponent(streamingData.subtitles[0].file)}&referer=${encodeURIComponent(streamingData.headers?.Referer || 'https://hianime.to/')}&download=${encodeURIComponent(formatDownloadFilename(selectedAnime.name, selectedEpisode.number) + '.vtt')}`}
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
            <p className="text-zinc-500 text-sm mb-4">Enter an anime name above to start downloading</p>
            <div className="text-xs text-zinc-600 max-w-md mx-auto">
              <p>Note: Downloads are sourced from third-party providers. If streaming sources fail to load, it may be due to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-left mx-auto w-fit">
                <li>External API temporary issues</li>
                <li>Server unavailability</li>
                <li>Episode not available for download</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
