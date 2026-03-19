"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  MediaPlayer,
  MediaProvider,
  Track,
  MediaPlayerInstance,
  Poster
} from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TrackData {
  url: string;
  lang: string;
  default?: boolean;
  type?: 'vtt' | 'ass' | 'srt' | 'ttml';
  label?: string;
}

interface EpisodeSource {
  url: string;
  isM3U8?: boolean;
  quality?: string;
}

interface VideoPlayerProps {
  sources: EpisodeSource[];
  tracks: TrackData[];
  poster?: string;
  referer?: string;
  intro?: { start: number; end: number };
  outro?: { start: number; end: number };
  onNext?: () => void;
  onSkipStateChange?: (state: "intro" | "outro" | null) => void;
  onError?: () => void;
  className?: string;
  isTheater?: boolean;
  autoPlay?: boolean;
  autoNext?: boolean;
  autoSkip?: boolean;
  initialTime?: number;
  onTimeUpdate?: (time: number, duration: number) => void;
  episodeTitle?: string;
}

const PROXY_LIST = [
  process.env.NEXT_PUBLIC_HLS_PROXY_PRIMARY || 'https://stream.voidanime.online/proxy?url=',
  process.env.NEXT_PUBLIC_HLS_PROXY_FALLBACK || 'https://proxy-xi-five.vercel.app/proxy?url=',
];

const buildProxyUrl = (url: string, referer?: string, proxyIndex: number = 0): string => {
  const baseProxy = PROXY_LIST[proxyIndex % PROXY_LIST.length];
  const encodedUrl = encodeURIComponent(url);
  
  if (referer) {
    // Try headers format first
    const headers = JSON.stringify({ Referer: referer });
    const encodedHeaders = encodeURIComponent(headers);
    const headersUrl = `${baseProxy}${encodedUrl}&headers=${encodedHeaders}`;
    
    // Also try origin format as fallback
    const originUrl = `${baseProxy}${encodedUrl}&origin=${encodeURIComponent(referer)}`;
    
    // Return headers format (most common)
    return headersUrl;
  }
  return `${baseProxy}${encodedUrl}`;
};

const isAssSubtitle = (url: string): boolean => {
  return url?.toLowerCase().includes('.ass') || url?.toLowerCase().includes('format=ass');
};

const getSubtitleType = (url: string): 'vtt' | 'ass' | 'srt' | 'ttml' => {
  const lowerUrl = url?.toLowerCase() || '';
  if (lowerUrl.includes('.ass') || lowerUrl.includes('format=ass')) return 'ass';
  if (lowerUrl.includes('.srt')) return 'srt';
  if (lowerUrl.includes('.ttml') || lowerUrl.includes('.xml')) return 'ttml';
  return 'vtt';
};

export default function VideoPlayer({
  sources,
  tracks,
  poster,
  referer,
  intro,
  outro,
  onNext,
  onSkipStateChange,
  onError,
  className,
  isTheater = false,
  autoPlay = true,
  autoNext = true,
  autoSkip = false,
  initialTime = 0,
  onTimeUpdate: externalTimeUpdate
}: VideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [proxyIndex, setProxyIndex] = useState(0);
  const proxyAttemptRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    // Basic detection for low-end devices
    if (typeof navigator !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const hasLowRam = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4;
      setIsLowEndDevice(isMobile || hasLowRam);
    }
  }, []);

  const skipRef = useRef(false);
  const initialTimeApplied = useRef(false);

  // Resume logic
  useEffect(() => {
    if (mounted && playerRef.current && initialTime > 0 && !initialTimeApplied.current) {
      playerRef.current.currentTime = initialTime;
      initialTimeApplied.current = true;
    }
  }, [mounted, initialTime]);

  const skipCurrentSection = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const t = player.currentTime;
    if (intro && t >= intro.start && t <= intro.end) player.currentTime = intro.end;
    else if (outro && t >= outro.start && t <= outro.end) player.currentTime = outro.end;
  }, [intro, outro]);

  useEffect(() => {
    const el = document.querySelector('[data-video-player]');
    if (el) (el as any)._skipSection = skipCurrentSection;
  }, [skipCurrentSection]);

  // Enhanced subtitle handling with ASS support
  const subtitleTracks = useMemo(() => {
    return tracks
      .filter((t) => t.lang !== "thumbnails" && t.url)
      .map((t, i) => {
        const subType = getSubtitleType(t.url);
        const isAss = subType === 'ass';
        
        return {
          default: t.default ?? i === 0,
          label: t.label || t.lang || `Subtitle ${i + 1}`,
          lang: (t.lang || 'en').toLowerCase(),
          src: buildProxyUrl(t.url, referer, proxyIndex),
          type: isAss ? 'subtitles' : 'subtitles',
          isAss,
        };
      });
  }, [tracks, referer, proxyIndex]);

  // ASS subtitles need special HLS.js configuration
  const hasAssSubtitles = useMemo(() => 
    subtitleTracks.some(t => t.isAss), 
  [subtitleTracks]);

  const thumbnailTrack = useMemo(() => tracks.find((t) => t.lang === "thumbnails" && t.url), [tracks]);
  const sourceUrl = sources[0]?.url;
  
  // Always apply proxy for CORS with fallback support
  const finalUrl = useMemo(() => {
    if (!sourceUrl) return null;
    return buildProxyUrl(sourceUrl, referer || undefined, proxyIndex);
  }, [sourceUrl, referer, proxyIndex]);

  const handleTimeUpdate = (time: number, duration: number) => {
    if (!mounted) return;
    const t = time;
    externalTimeUpdate?.(t, duration);

    if (intro && t >= intro.start && t <= intro.end) {
      onSkipStateChange?.("intro");
      if (autoSkip && !skipRef.current) {
        skipRef.current = true;
        playerRef.current!.currentTime = intro.end;
      }
    } else if (outro && t >= outro.start && t <= outro.end) {
      onSkipStateChange?.("outro");
      if (autoSkip && !skipRef.current) {
        skipRef.current = true;
        if (autoNext && onNext) setTimeout(onNext, 1000);
        else playerRef.current!.currentTime = outro.end;
      }
    } else {
      onSkipStateChange?.(null);
      skipRef.current = false;
    }
  };

  // ─── STABLE HLS CONFIGURATION WITH ASS SUPPORT ───
  const hlsOptions = useMemo(() => ({
    // Worker for better performance
    enableWorker: true,
    // Low latency for live content
    lowLatencyMode: false, // Disable for VOD to improve stability
    // Buffer configuration
    backBufferLength: isLowEndDevice ? 30 : 90,
    maxBufferLength: isLowEndDevice ? 10 : 30,
    maxMaxBufferLength: isLowEndDevice ? 30 : 600,
    // ABR settings
    abrEwmaFastLive: 1,
    abrEwmaSlowLive: 3,
    // Software decoding
    enableSoftwareAES: true,
    // Cap quality to prevent crashes
    capLevelToPlayerSize: true,
    // Subtitle rendering configuration
    enableWebVTT: true,
    // ASS subtitle support - HLS.js handles these natively when in HLS streams
    // For external ASS tracks, the proxy should convert them
    // Subtitle track settings
    startLevel: -1, // Auto quality
  }), [isLowEndDevice]);

  if (!finalUrl) return null;

  return (
    <div data-video-player className={cn(
      "group relative w-full bg-black overflow-hidden transition-all duration-700 select-none",
      isTheater ? "h-full rounded-none" : "aspect-video rounded-[32px] md:rounded-[48px] shadow-2xl border border-white/5",
      className
    )}>
      <AnimatePresence>
        {(isLoading || !mounted) && !error && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-[#06070a]">
            <div className="relative">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="w-24 h-24 rounded-full border-t-2 border-primary" />
              <img src="/logo-icon.png" className="absolute inset-0 m-auto w-10 h-10 animate-pulse" alt="Loading" />
            </div>
            <div className="mt-6 flex items-center gap-2 text-primary/40 animate-pulse">
              <Zap className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Optimizing Stream</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MediaPlayer
        ref={playerRef}
        src={finalUrl}
        autoPlay={mounted ? autoPlay : false}
        crossOrigin
        playsInline
        keyShortcuts={({ togglePictureInPicture: false } as any)}
        className="w-full h-full text-white group"
        onTimeUpdate={(e) => {
            const duration = playerRef.current?.state.duration || 0;
            handleTimeUpdate(e.currentTime, duration);
        }}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onError={(detail) => {
          console.error("[Vidstack] Media Error:", detail);
          if (detail.code !== 4) {
            // Try next proxy if current one fails
            if (proxyAttemptRef.current < PROXY_LIST.length - 1) {
              proxyAttemptRef.current += 1;
              setProxyIndex(prev => prev + 1);
              console.log(`[Proxy] Switching to proxy ${proxyAttemptRef.current + 1}: ${PROXY_LIST[proxyAttemptRef.current]}`);
              setIsLoading(true);
              setError(false);
              return;
            }
            setError(true);
            if (onError) onError();
          }
        }}
        style={{
          '--media-brand': '#9333ea',
          '--media-primary': '#9333ea',
          '--media-bg-color': 'rgba(6, 7, 10, 0.85)',
          '--media-border-radius': isTheater ? '0px' : '32px',
        } as any}
      >
        <MediaProvider {...({ hls: hlsOptions } as any)}>
          {poster && (
            <Poster
              src={poster}
              className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500 group-data-[playing]:opacity-0 group-data-[playing]:pointer-events-none"
            />
          )}
          {/* Subtitle Tracks - Supports VTT, SRT, and ASS formats via proxy */}
          {subtitleTracks.map((t, i) => (
            <Track 
              key={`${t.src}-${i}`} 
              src={t.src} 
              kind="subtitles" 
              label={t.label} 
              lang={t.lang} 
              default={t.default}
            />
          ))}
        </MediaProvider>
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          thumbnails={thumbnailTrack ? buildProxyUrl(thumbnailTrack.url, referer, proxyIndex) : undefined}
        />
      </MediaPlayer>
    </div>
  );
}
