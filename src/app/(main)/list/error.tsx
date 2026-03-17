'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function GenericError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4 selection:bg-anime-primary/30">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[40px] border border-[#2A2A2A] bg-[#1A1A1A]/50 p-10 space-y-6 backdrop-blur-3xl shadow-2xl"
        >
          <AlertCircle className="w-16 h-16 text-anime-primary mx-auto" />
          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-black text-white">Application Error</h1>
            <p className="text-zinc-400 text-sm">The system encountered an unexpected disruption.</p>
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed font-mono bg-black/40 p-4 rounded-xl border border-white/5">
            {error.message || 'Unknown System Failure'}
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <button onClick={reset} className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all shadow-xl hover:-translate-y-1">
            <RefreshCw size={16} /> Try Again
          </button>
          <Link href="/" className="flex items-center justify-center gap-3 w-full px-8 py-4 rounded-2xl bg-[#1A1A1A]/50 border border-[#2A2A2A] text-white font-black uppercase tracking-widest text-xs hover:bg-[#212121] transition-all hover:-translate-y-1">
            <Home size={16} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
