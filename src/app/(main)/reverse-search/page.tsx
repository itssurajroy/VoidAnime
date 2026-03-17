'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Upload, Image as ImageIcon, Loader2, ArrowRight, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { traceByUrl, traceByFile, getSimilarityColor, formatSimilarity, TraceMoeMatch, TraceMoeResponse } from '@/lib/api/tracemoe';

export default function ReverseSearchPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<TraceMoeMatch[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSearch = async () => {
    if (!imageUrl.trim()) return;
    await performSearch(imageUrl);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);
    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const data = await traceByFile(file);
      const searchResults = data.result || [];
      if (searchResults.length === 0) {
        setError('No matches found. Try a different image.');
      } else {
        setResults(searchResults);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search. The service may be rate limited. Please try again in a moment.');
    } finally {
      setIsSearching(false);
    }
  };

  const performSearch = async (url: string) => {
    setPreviewImage(url);
    setIsSearching(true);
    setError(null);
    setResults([]);

    try {
      const data = await traceByUrl(url);
      const searchResults = data.result || [];
      if (searchResults.length === 0) {
        setError('No matches found. Try a different image.');
      } else {
        setResults(searchResults);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search. The service may be rate limited. Please try again in a moment.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-8 h-8 text-anime-primary" />
            <span className="text-sm font-black uppercase tracking-widest text-zinc-500">Reverse Search</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Find That Anime
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Upload a screenshot or paste an image URL to find which anime it&apos;s from!
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL..."
                  className="w-full px-4 py-4 bg-[#212121] border border-[#2A2A2A] rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-anime-primary"
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlSearch()}
                />
              </div>
              <button
                onClick={handleUrlSearch}
                disabled={isSearching || !imageUrl.trim()}
                className="px-8 py-4 bg-anime-primary text-white font-bold rounded-2xl hover:bg-anime-primary/80 transition-all disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2A2A2A]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#1A1A1A] text-zinc-500">or upload an image</span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#212121] border-2 border-dashed border-[#2A2A2A] rounded-2xl text-zinc-400 font-bold hover:border-anime-primary hover:text-white transition-all"
            >
              <Upload className="w-5 h-5" />
              Choose File
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-center">
            {error}
          </div>
        )}

        <AnimatePresence>
          {previewImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto mb-12"
            >
              <div className="relative aspect-video rounded-3xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A]">
                <Image
                  src={previewImage}
                  alt="Search preview"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={() => { setPreviewImage(null); setResults([]); }}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-heading font-black text-white mb-6">
                {results.length} Results Found
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.slice(0, 8).map((result, index) => {
                  const title = result.anilistInfo?.title;
                  const titleText = title?.english || title?.romaji || 'Unknown';
                  return (
                  <Link
                    key={`${result.anilist}-${index}`}
                    href={`/anime/${titleText.toLowerCase().replace(/\s+/g, '-')}-${result.anilist}`}
                    className="flex gap-4 p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-anime-primary transition-all group"
                  >
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={result.image}
                        alt={titleText}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-anime-primary text-white text-xs font-black rounded">
                          BEST MATCH
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-black mb-1 ${getSimilarityColor(result.similarity)}`}>
                        {formatSimilarity(result.similarity)} match
                      </div>
                      <h3 className="font-bold text-white group-hover:text-anime-primary truncate">
                        {titleText}
                      </h3>
                      {title?.native && (
                        <p className="text-xs text-zinc-500 truncate">{title.native}</p>
                      )}
                      {result.episode && (
                        <p className="text-xs text-zinc-400 mt-2">Episode {result.episode}</p>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-anime-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );})}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
