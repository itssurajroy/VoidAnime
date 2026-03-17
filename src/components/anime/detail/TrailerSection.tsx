'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ExternalLink, AlertCircle, Youtube } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";

interface TrailerSectionProps {
  trailerUrl: string | null;
  thumbnailUrl?: string;
}

/** Error fallback — must be declared outside of render */
function ErrorFallback({ thumbnailUrl, trailerUrl }: { thumbnailUrl?: string; trailerUrl: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6 bg-gradient-to-br from-[#0B0C10] to-[#1a1033]">
      {thumbnailUrl && (
        <div className="absolute inset-0 opacity-20">
          <Image src={thumbnailUrl} alt="Trailer" fill className="object-cover blur-sm" />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <div className="space-y-2">
          <h4 className="text-lg font-black uppercase tracking-widest text-white">Embed Unavailable</h4>
          <p className="text-white/40 text-sm max-w-md">This trailer can&apos;t be embedded. Watch it directly on YouTube instead.</p>
        </div>
        <Button
          className="h-14 px-10 rounded-2xl bg-[#FF0000] hover:bg-[#CC0000] text-white font-black uppercase tracking-widest text-xs gap-3 shadow-xl"
          onClick={() => window.open(trailerUrl, '_blank')}
        >
          <Youtube className="w-5 h-5" />
          Watch on YouTube
        </Button>
      </div>
    </div>
  );
}

/** Separate component to safely use hooks for iframe error detection */
function TrailerIframe({ embedUrl, onError }: { embedUrl: string; onError: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Timeout fallback: if after 8 seconds the iframe is likely broken, show error 
    const timeout = setTimeout(() => {
      // YouTube embeds that fail show error pages inside the iframe
      // We can't access cross-origin content, so the timeout is a safety net
    }, 8000);

    // Listen for YouTube Player API error messages
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.event === 'onError' || data?.info?.playerError || data?.error) {
          onError();
        }
      } catch {
        // Not a JSON message, ignore
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
    };
  }, [onError]);

  return (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      className="absolute inset-0 w-full h-full"
      allow="autoplay; encrypted-media"
      allowFullScreen
      title="Anime Trailer"
      onError={() => onError()}
    />
  );
}

export function TrailerSection({ trailerUrl, thumbnailUrl }: TrailerSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!trailerUrl) return null;

  // Extract video ID for YouTube embed
  let videoId = "";
  if (trailerUrl.includes("youtube.com")) {
    videoId = trailerUrl.split("v=")[1]?.split("&")[0] || "";
  } else if (trailerUrl.includes("youtu.be")) {
    videoId = trailerUrl.split("youtu.be/")[1]?.split("?")[0] || "";
  }

  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : trailerUrl;

  return (
    <section>
      <SectionHeader title="Official Trailer" subtitle="Promotional Video" />
      <GlassPanel intensity="heavy" className="p-2 md:p-4 group overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video w-full rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#0B0C10] shadow-2xl border border-white/5"
        >
          <AnimatePresence mode="wait">
            {!isPlaying ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 cursor-pointer group/trailer"
                onClick={() => setIsPlaying(true)}
              >
                {thumbnailUrl ? (
                  <>
                    <Image
                      src={thumbnailUrl}
                      alt="Trailer Thumbnail"
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover opacity-50 group-hover/trailer:opacity-40 transition-all duration-700 group-hover/trailer:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-[#0B0C10]/80 opacity-60" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-900/20" />
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.5)] group-hover/trailer:scale-110 group-hover/trailer:bg-primary transition-all duration-500 backdrop-blur-md">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-black fill-current ml-1" />
                  </div>
                  <div className="px-6 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] opacity-0 group-hover/trailer:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover/trailer:translate-y-0">
                    Click to Play Trailer
                  </div>
                </div>

                <div className="absolute bottom-6 right-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full bg-white/10 hover:bg-white text-white hover:text-black border-none backdrop-blur-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(trailerUrl, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    YouTube
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black"
              >
                {videoId && !hasError ? (
                  <TrailerIframe
                    embedUrl={embedUrl}
                    onError={() => setHasError(true)}
                  />
                ) : (
                  <ErrorFallback thumbnailUrl={thumbnailUrl} trailerUrl={trailerUrl} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </GlassPanel>
    </section>
  );
}
