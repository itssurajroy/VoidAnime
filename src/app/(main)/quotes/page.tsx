'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Copy, Check, Share2, Heart } from 'lucide-react';
import { getRandomQuote } from '@/lib/api/animequotes';

export default function QuotesPage() {
  const [quote, setQuote] = useState<{ anime: string; character: string; quote: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const fetchNewQuote = () => {
    setQuote(getRandomQuote());
    setCopied(false);
    setLiked(false);
  };

  useEffect(() => {
    fetchNewQuote();
  }, []);

  const copyToClipboard = async () => {
    if (!quote) return;
    await navigator.clipboard.writeText(`"${quote.quote}" - ${quote.character}, ${quote.anime}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] selection:bg-anime-primary/30 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          key={quote?.quote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-[40px] p-8 md:p-12 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-anime-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-2 mb-8">
              <Sparkles className="w-5 h-5 text-anime-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Quote of the Moment</span>
            </div>

            <blockquote className="relative">
              <span className="absolute -top-4 -left-2 text-8xl text-anime-primary/20 font-black">"</span>
              <p className="text-xl md:text-2xl font-heading font-bold text-white leading-relaxed mb-6 pl-8">
                {quote?.quote}
              </p>
            </blockquote>

            <div className="flex items-center gap-3 pl-8">
              <span className="text-lg font-bold text-anime-primary">{quote?.character}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-sm text-zinc-400">{quote?.anime}</span>
            </div>

            <div className="flex flex-wrap gap-3 mt-10 pl-8">
              <button
                onClick={fetchNewQuote}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white font-bold hover:bg-[#2A2A2A] transition-all"
              >
                <RefreshCw className="w-4 h-4" /> New Quote
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white font-bold hover:bg-[#2A2A2A] transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-white font-bold hover:bg-[#2A2A2A] transition-all"
              >
                <Heart className={`w-4 h-4 ${liked ? 'text-red-500 fill-red-500' : ''}`} />
                {liked ? 'Liked!' : 'Like'}
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-anime-primary text-white font-bold hover:bg-anime-primary/80 transition-all">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-zinc-500 text-sm">Powered by VoidAnime Quotes</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
