'use client';

import { useState, useEffect } from 'react';
import { Clock, Bell, Info, Share2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHasMounted } from '@/hooks/useHasMounted';

interface AiringCountdownProps {
  episode: number;
  airingAt: number;
  color?: string;
}

export function AiringCountdown({ episode, airingAt, color = '#9D4EDE' }: AiringCountdownProps) {
  const hasMounted = useHasMounted();
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isAiring: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isAiring: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const difference = airingAt - now;

      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, isAiring: true }));
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (24 * 60 * 60)),
        hours: Math.floor((difference / (60 * 60)) % 24),
        minutes: Math.floor((difference / 60) % 60),
        seconds: Math.floor(difference % 60),
        isAiring: false
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [airingAt]);

  if (timeLeft.isAiring) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-4 rounded-2xl backdrop-blur-md"
      >
        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-white font-black uppercase tracking-tighter text-lg leading-tight">Episode {episode} is Airing!</h3>
          <p className="text-green-400/70 text-[10px] font-bold uppercase tracking-widest">Available now on streaming platforms</p>
        </div>
      </motion.div>
    );
  }

  const TimeBlock = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative group">
         <div 
          className="absolute inset-0 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-lg"
          style={{ backgroundColor: color }}
         />
         <div className="relative w-14 h-16 md:w-16 md:h-20 bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-xl flex items-center justify-center shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span 
                key={value}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: "circOut" }}
                className="text-2xl md:text-3xl font-black text-white"
              >
                {value.toString().padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-30" style={{ backgroundColor: color }} />
         </div>
      </div>
      <span className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-anime-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-anime-primary"></span>
          </span>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300">Next Episode Countdown</h3>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
            <Bell className="w-3.5 h-3.5 group-hover:text-anime-primary transition-colors" /> Notify Me
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <TimeBlock value={timeLeft.days} label="Days" />
            <span className="text-2xl font-black text-white/10 mb-6">:</span>
            <TimeBlock value={timeLeft.hours} label="Hours" />
            <span className="text-2xl font-black text-white/10 mb-6">:</span>
            <TimeBlock value={timeLeft.minutes} label="Mins" />
            <span className="text-2xl font-black text-white/10 mb-6">:</span>
            <TimeBlock value={timeLeft.seconds} label="Secs" />
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#212121] rounded-full overflow-hidden border border-[#2A2A2A]">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${Math.max(0, Math.min(100, (1 - (timeLeft.days * 86400 + timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds) / 604800) * 100))}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
               style={{ backgroundColor: color }}
             />
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-center pl-6 border-l border-[#2A2A2A] space-y-2">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#212121] flex items-center justify-center text-zinc-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Airing Episode</span>
                <span className="text-sm font-black text-white">EPISODE {episode}</span>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#212121] flex items-center justify-center text-zinc-300">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Scheduled Time</span>
                <span className="text-sm font-black text-white">
                  {hasMounted ? new Date(airingAt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
