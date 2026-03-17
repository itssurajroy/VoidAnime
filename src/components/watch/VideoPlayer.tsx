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

const proxyVtt = (url: string, referer?: string) =>
  `/api/proxy-vtt?url=${encodeURIComponent(url)}${referer ? `&referer=${encodeURIComponent(referer)}` : ""}&ext=.vtt`;

const proxyM3U8 = (url: string, referer?: string) =>
  `/api/proxy?url=${encodeURIComponent(url)}${referer ? `&referer=${encodeURIComponent(referer)}` : ""}`;

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

  const subtitleTracks = useMemo(() => tracks
    .filter((t) => t.lang !== "thumbnails" && t.url)
    .map((t, i) => ({
      default: t.default ?? i === 0,
      label: t.lang ?? `Subtitle ${i + 1}`,
      src: proxyVtt(t.url, referer),
    })), [tracks, referer]);

  const thumbnailTrack = useMemo(() => tracks.find((t) => t.lang === "thumbnails" && t.url), [tracks]);
  const sourceUrl = sources[0]?.url;
  const finalUrl = useMemo(() => referer && sourceUrl ? proxyM3U8(sourceUrl, referer) : sourceUrl, [sourceUrl, referer]);

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

  // ─── STABLE HLS CONFIGURATION ───
  const hlsOptions = useMemo(() => ({
    enableWorker: true,
    lowLatencyMode: true,
    backBufferLength: isLowEndDevice ? 30 : 90,
    maxBufferLength: isLowEndDevice ? 10 : 30,
    maxMaxBufferLength: isLowEndDevice ? 30 : 600,
    // Standard ABR and buffering
    abrEwmaFastLive: 1,
    abrEwmaSlowLive: 3,
    enableSoftwareAES: true,
    // Ensure it doesn't crash on high-quality start
    capLevelToPlayerSize: true,
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
          if (detail.code !== 4) { // Ignore minor abort errors
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
          {subtitleTracks.map((t) => (
            <Track key={t.src} src={t.src} kind="subtitles" label={t.label} lang={t.label.toLowerCase()} default={t.default} />
          ))}
        </MediaProvider>
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          thumbnails={thumbnailTrack ? proxyVtt(thumbnailTrack.url, referer) : undefined}
        />
      </MediaPlayer>
    </div>
  );
}
