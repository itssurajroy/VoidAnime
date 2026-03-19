'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Home, RefreshCcw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/10 blur-[120px] rounded-full animate-pulse-soft" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 max-w-md w-full"
      >
        {/* Icon Container */}
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 rounded-[32px] bg-destructive/10 border border-destructive/20 flex items-center justify-center animate-bounce-slow">
            <ShieldAlert className="w-12 h-12 text-destructive" />
          </div>
          <div className="absolute -inset-4 bg-destructive/5 blur-2xl rounded-full -z-10" />
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">
          Service Error
        </h1>
        <p className="text-white/50 text-[15px] font-medium leading-relaxed mb-10 px-4">
          Something went wrong while processing your request. Our team has been notified of this error.
        </p>

        {/* Error Details (Optional/Admin) */}
        {process.env.NODE_ENV === 'development' && (
           <div className="mb-10 p-4 rounded-2xl bg-black/40 border border-white/5 text-left overflow-auto max-h-40 custom-scrollbar">
             <code className="text-[11px] font-mono text-destructive/80 break-all uppercase">
               {error.message || 'Unknown Error'}
             </code>
           </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-primary text-white hover:bg-white hover:text-black transition-all duration-500 font-black uppercase tracking-widest text-[11px] gap-3 shadow-xl shadow-primary/20"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Link href="/home" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all duration-500 font-black uppercase tracking-widest text-[11px] gap-3"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="mt-20 flex items-center gap-2 opacity-10">
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-12 h-[1px] bg-gradient-to-r from-white to-transparent" />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">VoidAnime</span>
      </div>
    </div>
  );
}
