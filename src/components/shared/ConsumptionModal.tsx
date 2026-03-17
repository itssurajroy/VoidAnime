'use client';

import { X, Play, Shield, AlertTriangle, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UNOFFICIAL_SOURCES, AD_LEVEL_CONFIG } from '@/lib/utils/streamingLinks';
import { useState, useEffect } from 'react';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useKeyPress } from '@/hooks/useKeyPress';

interface ConsumptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'anime' | 'manga';
  episodeOrChapter?: number;
  legalSources: { site: string; url: string }[];
}

export function ConsumptionModal({ isOpen, onClose, title, type, episodeOrChapter, legalSources }: ConsumptionModalProps) {
  const [filter, setFilter] = useState<'all' | 'stream' | 'read' | 'download'>('all');
  const [showUnofficial, setShowUnofficial] = useState(false);

  useScrollLock(isOpen);
  useKeyPress('Escape', onClose);

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch (e) {
      return null;
    }
  };

  const filtered = UNOFFICIAL_SOURCES.filter(s => 
    s.category === type && (
      filter === 'all' ? true :
      filter === 'stream' ? s.type.includes('stream') :
      filter === 'read' ? s.type.includes('read') :
      ['ddl', 'torrent'].includes(s.type)
    )
  );

  const themeColor = type === 'anime' ? 'text-anime-primary' : 'text-anime-secondary';
  const themeBg = type === 'anime' ? 'bg-anime-primary/20' : 'bg-anime-secondary/20';
  const Icon = type === 'anime' ? Play : BookOpen;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: '100%' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-[#161616] border border-[#2A2A2A] rounded-t-2xl sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-[#2A2A2A] flex items-center justify-between bg-[#0D0D0D]/50">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${themeBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${themeColor} ${type === 'anime' ? 'fill-current' : ''}`} />
                </div>
                <div>
                  <h2 id="modal-title" className="text-lg sm:text-xl font-heading font-black text-white">
                    {type === 'anime' ? `Watch Episode ${episodeOrChapter || 1}` : `Read ${title}`}
                  </h2>
                  <p className="text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-widest line-clamp-1">{title}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-[#212121] hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 scrollbar-thin">
              
              {/* Official Sources */}
              <section>
                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-green-400 mb-4">
                  <Shield className="w-3.5 h-3.5" /> Official Platforms
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {legalSources.map((src, i) => {
                    const favicon = getFavicon(src.url);
                    return (
                      <a key={`${src.url}-${i}`} href={src.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-2xl border border-[#2A2A2A] bg-[#212121] hover:bg-green-500/10 transition-all group min-h-[44px]">
                        <div className="w-8 h-8 rounded-lg bg-[#0D0D0D] border border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden relative">
                          {favicon ? (
                            <img src={favicon} alt="" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-[8px] font-black text-zinc-400">{src.site.slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-zinc-300 group-hover:text-white truncate">{src.site}</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                      </a>
                    );
                  })}
                  {legalSources.length === 0 && (
                    <p className="text-xs text-zinc-400 italic p-4 bg-[#212121] rounded-2xl border border-dashed border-[#2A2A2A] text-center col-span-full">
                      No direct {type === 'anime' ? 'episode' : 'reading'} links detected for this title.
                    </p>
                  )}
                </div>
              </section>

              {/* Unofficial Index */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">
                    <AlertTriangle className="w-3.5 h-3.5" /> Community Index
                  </h3>
                  {!showUnofficial && (
                    <button 
                      onClick={() => setShowUnofficial(true)}
                      className="px-6 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500/20 transition-all shadow-lg"
                    >
                      Show Community Links
                    </button>
                  )}
                  {showUnofficial && (
                    <div className="flex gap-2 p-1 bg-[#1A1A1A] rounded-xl text-white">
                      {['all', type === 'anime' ? 'stream' : 'read', 'download'].map(f => (
                        <button 
                          key={f}
                          onClick={() => setFilter(f as any)}
                          className={`px-3 py-1.5 min-h-[32px] rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${filter === f ? (type === 'anime' ? 'bg-anime-primary text-white' : 'bg-anime-secondary text-white') : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {showUnofficial && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden"
                    >
                      {filtered.map((src, i) => {
                        const fullUrl = typeof src.url === 'function' ? src.url(title) : src.url;
                        const favicon = getFavicon(fullUrl);
                        const adConfig = AD_LEVEL_CONFIG[src.adLevel];
                        return (
                          <a key={`${src.name}-${i}`} href={fullUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-start gap-4 p-4 rounded-3xl border border-[#2A2A2A] bg-[#1A1A1A]/30 hover:bg-[#212121] transition-all group shadow-lg min-h-[44px]"
                          >
                            <div className="w-10 h-10 rounded-xl bg-[#212121] border border-[#2A2A2A] flex items-center justify-center shrink-0 overflow-hidden relative">
                              {favicon ? (
                                <img src={favicon} alt="" className="w-full h-full object-contain p-1.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                              ) : (
                                <Icon className={`w-4 h-4 text-zinc-500 ${type === 'anime' ? 'fill-current' : ''}`} />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-sm text-zinc-200 group-hover:${themeColor} transition-colors`}>{src.name}</span>
                                {src.recommended && <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{src.quality}</span>
                                <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${adConfig.bg} ${adConfig.color} border border-[#2A2A2A]`}>
                                  {adConfig.label}
                                </span>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </div>

            {/* Footer Disclaimer */}
            <div className="p-6 bg-[#0D0D0D]/80 text-[10px] text-zinc-500 italic text-center border-t border-[#2A2A2A]">
              VoidAnime does not host any content. Links are provided for community indexing purposes only.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
