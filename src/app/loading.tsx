'use client';

import { motion } from 'framer-motion';

export default function GlobalLoading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full animate-pulse-soft" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Animated Logo Container */}
        <div className="mb-10 relative">
          <div className="relative group cursor-pointer transition-transform duration-500 hover:scale-110">
              <div className="flex items-baseline">
                  <span className="text-white text-5xl font-black tracking-tight font-headline">void</span>
                  <span className="text-primary text-5xl font-black ml-1 animate-pulse">!</span>
                  <span className="text-white text-5xl font-black font-headline">anime</span>
              </div>
          </div>
          
          {/* Animated Glow behind logo */}
          <div className="absolute -inset-8 bg-primary/10 blur-3xl rounded-full animate-pulse-soft -z-10" />
        </div>

        {/* Loading Progress Bar */}
        <div className="w-64 h-1 rounded-full bg-white/5 relative overflow-hidden mb-6">
          <motion.div
             initial={{ x: '-100%' }}
             animate={{ x: '100%' }}
             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>

        {/* Status Text */}
        <div className="flex flex-col gap-2">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 animate-pulse">
             Loading Episode List
           </span>
           <div className="flex items-center justify-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0s' }} />
             <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
             <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }} />
           </div>
        </div>
      </motion.div>

      {/* Background Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-20 pointer-events-none" />
    </div>
  );
}
