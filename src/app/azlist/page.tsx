'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronRight, LayoutGrid, ListFilter, Search, Globe, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { GlassPanel } from "@/components/ui/GlassPanel";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function AZListIndexPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
      {/* ─── ANIMATED BACKGROUND MESH ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* ─── PREMIUM HERO HEADER ─── */}
      <div className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-white/5">
        <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <Breadcrumbs items={[{ label: "A-Z List" }]} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_20px_#9333ea]" />
                  <h1 className="text-6xl lg:text-8xl font-[1000] text-white uppercase tracking-tighter font-headline leading-[0.8] italic">
                    Browse <span className="text-primary block">Directory</span>
                  </h1>
                </div>
              </div>
              
              <p className="text-white/40 text-lg font-medium max-w-xl leading-relaxed italic tracking-wide">
                Experience our comprehensive anime database. Find your favorite series instantly through our high-speed alphabetical index.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-6"
            >
                <GlassPanel intensity="heavy" className="p-8 md:p-10 flex items-center gap-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/10 rounded-[40px]">
                    <div className="text-center">
                        <div className="text-4xl font-[1000] text-white font-headline tracking-tighter italic">15K+</div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">Total Titles</div>
                    </div>
                    <div className="w-px h-14 bg-white/10" />
                    <div className="text-center">
                        <div className="text-4xl font-[1000] text-primary font-headline tracking-tighter italic">4K</div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1">HD Quality</div>
                    </div>
                </GlassPanel>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* ─── SIDEBAR CONTROLS ─── */}
            <aside className="lg:col-span-3 space-y-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                    <div className="flex items-center gap-4 ml-2">
                        <div className="w-1 h-5 bg-primary rounded-full" />
                        <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Navigation</h4>
                    </div>
                    
                    <GlassPanel intensity="light" className="p-4 space-y-3 rounded-[32px]">
                        <Link href="/azlist/all" className="flex items-center gap-4 p-5 rounded-2xl bg-primary text-black font-[1000] uppercase tracking-widest text-[11px] shadow-[0_10px_30px_rgba(147,51,234,0.3)] hover:bg-white transition-all duration-500 group">
                            <LayoutGrid className="w-4 h-4 transition-transform group-hover:rotate-90 duration-500" />
                            Complete Catalog
                        </Link>
                        <Link href="/search" className="flex items-center gap-4 p-5 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 font-black uppercase tracking-widest text-[11px] group">
                            <div className="w-0 h-1 bg-primary rounded-full group-hover:w-3 transition-all duration-500" />
                            Advanced Filter
                        </Link>
                    </GlassPanel>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <GlassPanel intensity="medium" className="p-8 space-y-6 rounded-[40px] border-primary/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Zap className="w-12 h-12 text-primary" />
                      </div>
                      <div className="relative z-10 space-y-4">
                          <h4 className="text-white font-[1000] text-2xl uppercase tracking-tighter font-headline italic leading-none">Instant <span className="text-primary block">Access</span></h4>
                          <p className="text-white/40 text-[11px] font-black uppercase tracking-widest leading-loose">
                              Our optimized index ensures fast loading during discovery. Click any index to begin.
                          </p>
                      </div>
                  </GlassPanel>
                </motion.div>
            </aside>

            {/* ─── MAIN ALPHABET GRID ─── */}
            <main className="lg:col-span-9 space-y-16">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                    <div className="flex items-center gap-4">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="text-4xl font-[1000] text-white uppercase tracking-tighter font-headline italic">Search by <span className="text-primary">Character</span></h2>
                    </div>
                    <div className="h-1 w-32 bg-primary/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full w-full bg-primary"
                      />
                    </div>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    <Link 
                        href="/azlist/all"
                        className="group relative aspect-square flex flex-col items-center justify-center overflow-hidden"
                    >
                        <GlassPanel intensity="medium" className="absolute inset-0 group-hover:bg-primary/5 group-hover:border-primary/50 transition-all duration-500 rounded-[32px] md:rounded-[40px]" children={null} />
                        <span className="relative z-10 text-3xl font-[1000] text-white group-hover:text-primary transition-colors duration-500 font-headline uppercase italic">All</span>
                        <span className="relative z-10 mt-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-primary/40 transition-colors">Catalog</span>
                    </Link>

                    <Link 
                        href="/azlist/0-9"
                        className="group relative aspect-square flex flex-col items-center justify-center overflow-hidden"
                    >
                        <GlassPanel intensity="medium" className="absolute inset-0 group-hover:bg-primary/5 group-hover:border-primary/50 transition-all duration-500 rounded-[32px] md:rounded-[40px]" children={null} />
                        <span className="relative z-10 text-3xl font-[1000] text-white group-hover:text-primary transition-colors duration-500 font-headline uppercase italic">0-9</span>
                        <span className="relative z-10 mt-2 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] group-hover:text-primary/40 transition-colors">Numeric</span>
                    </Link>

                    {alphabet.map((letter, i) => (
                        <motion.div
                          key={letter}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.02 }}
                        >
                          <Link 
                              href={`/azlist/${letter.toLowerCase()}`}
                              className="group relative aspect-square flex flex-col items-center justify-center overflow-hidden"
                          >
                              <GlassPanel intensity="medium" className="absolute inset-0 group-hover:bg-primary/5 group-hover:border-primary/50 transition-all duration-500 rounded-[32px] md:rounded-[40px]" children={null} />
                              <span className="relative z-10 text-4xl font-[1000] text-white group-hover:text-primary transition-all duration-500 font-headline uppercase italic group-hover:scale-110">{letter}</span>
                              <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500">
                                  <ChevronRight className="w-5 h-5 text-primary" />
                              </div>
                          </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
      </div>
    </div>
  );
}
