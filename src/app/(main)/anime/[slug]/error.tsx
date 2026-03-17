'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { RefreshCw, Home, AlertCircle, Zap } from 'lucide-react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AnimeError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Anime detail error:', error);
  }, [error]);

  const isRateLimit = error.message?.includes('429') || error.message?.includes('rate limit');
  const isNetwork = error.message?.includes('fetch') || error.message?.includes('network');

  const errorConfig = isRateLimit
    ? {
        emoji: '⏳',
        title: 'Rate Limit Hit',
        subtitle: 'The archives are cooling down',
        description: 'We hit the API rate limit. Wait a moment and try again — this usually resolves in under 60 seconds.',
        color: 'text-yellow-400',
        border: 'border-yellow-500/20',
        bg: 'bg-yellow-500/5',
      }
    : isNetwork
    ? {
        emoji: '📡',
        title: 'Connection Lost',
        subtitle: 'Unable to reach the database',
        description: 'Check your internet connection and try again. The anime servers might also be temporarily down.',
        color: 'text-blue-400',
        border: 'border-blue-500/20',
        bg: 'bg-blue-500/5',
      }
    : {
        emoji: '💥',
        title: 'System Error',
        subtitle: 'An unexpected error occurred',
        description: 'Our servers hit an unexpected error loading this anime. The support team has been notified.',
        color: 'text-anime-primary',
        border: 'border-anime-primary/20',
        bg: 'bg-anime-primary/5',
      };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 selection:bg-anime-primary/30">
      <div className="max-w-md w-full text-center space-y-8">

        {/* Error Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-[40px] border ${errorConfig.border} ${errorConfig.bg} p-10 space-y-6 backdrop-blur-3xl shadow-2xl relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#212121] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-7xl mb-4 inline-block filter drop-shadow-2xl"
          >
            {errorConfig.emoji}
          </motion.div>

          <div className="space-y-2">
            <div className={`text-[10px] font-black tracking-[0.3em] uppercase ${errorConfig.color}`}>
              Data Retrieval Failure
            </div>
            <h1 className="text-3xl font-heading font-black text-white">
              {errorConfig.title}
            </h1>
            <p className="text-zinc-400 text-sm font-medium">{errorConfig.subtitle}</p>
          </div>

          <p className="text-zinc-500 text-xs leading-relaxed font-medium">
            {errorConfig.description}
          </p>

          {error.digest && (
            <div className="bg-black/40 rounded-xl px-4 py-2 font-mono text-[10px] text-white/20 border border-[#2A2A2A]">
              Error ID: {error.digest}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button onClick={reset}
            className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl
                       bg-white text-black font-black uppercase tracking-widest text-xs
                       hover:bg-gray-200 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link href="/"
            className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl
                       bg-[#1A1A1A]/50 border border-[#2A2A2A] text-white font-black uppercase tracking-widest text-xs
                       hover:bg-[#212121] transition-all hover:-translate-y-1 backdrop-blur-xl">
            <Home size={16} />
            Back to Home
          </Link>
        </div>

        {/* Real-time Status */}
        <div className="rounded-[32px] border border-[#2A2A2A] bg-[#1A1A1A]/30 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4 text-white/20">
            <Zap className="w-3 h-3" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Server Status</p>
          </div>
          <div className="space-y-3">
            {[
              { name: 'AniList GraphQL', status: isNetwork ? 'Offline' : 'Online', color: isNetwork ? 'text-red-400' : 'text-green-400' },
              { name: 'Jikan MAL Gateway', status: isRateLimit ? 'Limited' : 'Checking', color: isRateLimit ? 'text-yellow-400' : 'text-white/20' },
              { name: 'Consumet Streaming', status: 'Online', color: 'text-green-400' },
            ].map(src => (
              <div key={src.name} className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{src.name}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${src.color.replace('text-', 'bg-')} animate-pulse`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${src.color}`}>{src.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
