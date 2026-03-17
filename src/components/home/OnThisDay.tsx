'use client';

import { motion } from 'framer-motion';
import { History, Calendar, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useListStore } from '@/store/listStore';

export function OnThisDay() {
  const { entries } = useListStore();
  
  const completedEntries = Object.values(entries).filter(e => e.status === 'COMPLETED');
  
  const today = new Date();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  
  const matchingEntries = completedEntries.filter(entry => {
    if (!entry.timestamps.completed) return false;
    const completed = entry.timestamps.completed;
    const completedDate = new Date(completed.seconds * 1000);
    return completedDate.getMonth() + 1 === todayMonth && completedDate.getDate() === todayDay;
  });

  const yearsAgo = matchingEntries.length > 0 && matchingEntries[0].timestamps.completed 
    ? today.getFullYear() - new Date(matchingEntries[0].timestamps.completed.seconds * 1000).getFullYear()
    : null;

  if (Object.keys(entries).length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-3xl relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-anime-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-2 mb-4 text-anime-primary">
          <History className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Memory Lane</span>
        </div>

        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Lock className="w-8 h-8 text-white/20 mb-3" />
          <h3 className="text-lg font-heading font-black text-white mb-2">Login to View</h3>
          <p className="text-sm text-white/40">Track your anime to see memories from this day.</p>
        </div>

        <Link 
          href="/login" 
          className="flex items-center justify-center w-full p-3 rounded-2xl bg-anime-primary/10 border border-anime-primary/20 text-anime-primary font-bold text-sm hover:bg-anime-primary/20 transition-all"
        >
          Sign In
        </Link>
      </motion.div>
    );
  }

  if (!yearsAgo || matchingEntries.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-3xl relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-anime-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-2 mb-4 text-anime-primary">
          <History className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Memory Lane</span>
        </div>

        <h3 className="text-lg font-heading font-black text-white mb-2 leading-tight">
          No Memories Today
        </h3>
        
        <p className="text-sm text-white/50 mb-6">
          You haven't completed any anime on this day in previous years.
        </p>

        <div className="flex flex-col gap-2">
          <Link 
            href="/stats" 
            className="flex items-center justify-between p-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] hover:bg-white/10 transition-all group/item"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase">View Full History</span>
            </div>
            <Calendar className="w-3 h-3 text-white/20 group-hover/item:text-white transition-colors" />
          </Link>
        </div>
      </motion.div>
    );
  }

  const entry = matchingEntries[0];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-3xl relative overflow-hidden group shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-anime-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-center gap-2 mb-4 text-anime-primary">
        <History className="w-4 h-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">Memory Lane</span>
      </div>

      <h3 className="text-lg font-heading font-black text-white mb-2 leading-tight">
        {yearsAgo} Year{yearsAgo > 1 ? 's' : ''} Ago Today
      </h3>
      
      <p className="text-sm text-white/50 mb-6">
        You completed <span className="text-white font-bold">{entry.title}</span>. Feel old yet?
      </p>

      <div className="flex flex-col gap-2">
        <Link 
          href="/stats" 
          className="flex items-center justify-between p-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] hover:bg-white/10 transition-all group/item"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-[10px] font-bold text-zinc-300 uppercase">View Log</span>
          </div>
          <Calendar className="w-3 h-3 text-white/20 group-hover/item:text-white transition-colors" />
        </Link>
      </div>
    </motion.div>
  );
}
