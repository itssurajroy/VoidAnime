'use client';

import { motion } from 'framer-motion';
import { Plane, MapPin, Award, Shield, Zap, Flame, Star } from 'lucide-react';
import Image from 'next/image';

const ICON_MAP: Record<string, any> = {
  plane: Plane,
  mapPin: MapPin,
  award: Award,
  shield: Shield,
  zap: Zap,
  flame: Flame,
  star: Star
};

interface StampProps {
  title: string;
  category: string;
  date: string;
  image: string;
  iconName: string; // Pass name instead of component
  color: string;
}

function PassportStamp({ title, category, date, image, iconName, color }: StampProps) {
  const Icon = ICON_MAP[iconName] || Star;

  return (
    <motion.div 
      whileHover={{ scale: 1.05, rotate: -2 }}
      className="relative w-40 h-40 flex items-center justify-center p-2 group"
    >
      <div className={`absolute inset-0 border-4 border-dashed rounded-full opacity-20 group-hover:opacity-40 transition-opacity ${color}`} />
      
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[#2A2A2A] flex flex-col items-center justify-center bg-[#1A1A1A]/80 backdrop-blur-md shadow-xl text-center p-4">
        <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        
        <div className="relative z-10 space-y-1">
          <Icon className={`w-6 h-6 mx-auto ${color.replace('border-', 'text-')}`} />
          <p className="text-[10px] font-black uppercase tracking-tighter text-white line-clamp-1">{title}</p>
          <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{category}</p>
          <p className="text-[8px] font-mono text-white/20">{date}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function AnimePassport({ username, stamps }: { username: string, stamps: StampProps[] }) {
  return (
    <div className="bg-[#1a1625] rounded-[40px] p-8 md:p-12 shadow-2xl border-t-8 border-l-8 border-[#2A2A2A] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Plane className="w-8 h-8 text-anime-primary" />
              <h2 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-tighter">Anime Traveler</h2>
            </div>
            <p className="text-anime-accent/60 font-mono text-sm uppercase">IDENTIFICATION: {username.toUpperCase()}</p>
          </div>
          <div className="px-6 py-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] backdrop-blur-xl">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-1">Total Territory</p>
            <p className="text-2xl font-black text-white">{stamps.length} STAMPS</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {stamps.map((stamp, i) => (
            <PassportStamp key={i} {...stamp} />
          ))}
          
          {[...Array(Math.max(0, 5 - stamps.length))].map((_, i) => (
            <div key={i} className="w-40 h-40 rounded-full border-2 border-dashed border-[#2A2A2A] flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white/5" />
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[#2A2A2A] flex justify-between items-center">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Global Anime Union • Valid 2026</p>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-xl bg-[#212121] border border-[#2A2A2A]" />
            <div className="w-12 h-12 rounded-xl bg-[#212121] border border-[#2A2A2A]" />
          </div>
        </div>
      </div>
    </div>
  );
}
