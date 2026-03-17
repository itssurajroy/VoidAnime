'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, KeyboardEvent, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Menu as MenuIcon, X, Shuffle, User, SlidersHorizontal, 
  Loader2, MessageCircle, Rss, LucideIcon, Send, Mail, Github, 
  Instagram, Youtube, Facebook, Twitter, Home, Film, Tv, Star, Zap, Settings,
  Users, Newspaper
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUser } from '@/firebase';
import { UserNav } from './UserNav';
import { NotificationBell } from './NotificationBell';
import { AuthTrigger } from '../auth/AuthTrigger';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getSearchSuggestions } from '@/services/anime';
import { MobileMenu } from './MobileMenu';
import { useToast } from '@/hooks/use-toast';
import { useSiteConfig } from '@/components/SettingsProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSuggestion {
  id: string;
  name: string;
  poster: string;
  jname: string;
  moreInfo: string[];
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { config, loading: configLoading } = useSiteConfig();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDownShortcut = (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        if (searchInput instanceof HTMLInputElement) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDownShortcut);
    return () => window.removeEventListener('keydown', handleKeyDownShortcut);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const response = await getSearchSuggestions(encodeURIComponent(searchQuery));
        if (response.data?.suggestions) {
          setSuggestions(response.data.suggestions.slice(0, 6));
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setMobileSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const renderSuggestions = (isMobile = false) => {
    return (
      <AnimatePresence>
        {(showSuggestions || isLoadingSuggestions) && searchQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute top-full left-0 right-0 mt-3 bg-[#121316]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[150]",
              isMobile ? "max-h-[70vh] overflow-y-auto mx-4" : "max-h-[550px] overflow-y-auto"
            )}
          >
            <div className="px-4 py-3 bg-white/[0.02] border-b border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Search Results</span>
              {isLoadingSuggestions && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
            </div>
            
            <div className="p-2">
              {suggestions.length > 0 ? (
                <>
                  {suggestions.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <Link
                        href={`/watch/${item.id}`}
                        onClick={() => { setShowSuggestions(false); setMobileSearchOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-4 p-2.5 hover:bg-primary/10 rounded-xl transition-all group/item mb-1 last:mb-0"
                      >
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-lg border border-white/5">
                          <Image src={item.poster} alt={item.name} fill sizes="48px" className="object-cover transition-transform duration-500 group-hover/item:scale-110" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-[14px] font-bold text-white truncate group-hover/item:text-primary transition-colors">{item.name}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[11px] text-white/40 truncate max-w-[150px]">{item.jname}</p>
                            <div className="h-1 w-1 rounded-full bg-white/10" />
                            <div className="flex items-center gap-1.5">
                              {item.moreInfo.map((info, i) => (
                                <span key={`${info}-${i}`} className="text-[9px] font-black text-primary/60 uppercase tracking-wider bg-primary/5 px-1.5 py-0.5 rounded-md border border-primary/10">
                                  {info}
                                </span>
                              ))}
                            </div>                          </div>
                        </div>
                        <div className="opacity-0 group-hover/item:opacity-100 transition-opacity pr-2">
                          <Zap className="w-4 h-4 text-primary fill-primary" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  <div className="mt-2 p-1">
                    <button 
                      onClick={handleSearch} 
                      className="w-full py-3 bg-primary text-black hover:bg-white transition-all duration-300 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group"
                    >
                      <span>Search all results</span>
                      <Search className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </>
              ) : !isLoadingSuggestions ? (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-white/20" />
                  </div>
                  <p className="text-white font-bold text-sm uppercase tracking-widest">No results found</p>
                  <p className="text-white/30 text-[11px] uppercase tracking-wider">Try searching for something else</p>
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] animate-pulse">Searching the void...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  if (pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }

  if (configLoading || !config) return null;

  return (
    <>
      <header className={cn(
        "sticky top-0 z-[100] w-full transition-all duration-500 h-[80px]",
        scrolled 
          ? "bg-[#0B0C10]/80 backdrop-blur-xl border-b border-primary/20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] h-[70px]" 
          : "bg-[#0B0C10] border-b border-white/5"
      )}>
        <div className="max-w-[1920px] mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-4 sm:gap-8">

          {/* Left Section: Menu & Logo */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 text-white/60 hover:text-primary transition-all active:scale-90 bg-white/5 rounded-xl border border-white/5 hover:border-primary/20"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            <Link href="/home" className="flex items-center shrink-0 group gap-1 cursor-pointer transition-transform hover:scale-105">
              <span className="text-white text-2xl font-black tracking-tight font-headline uppercase italic">void</span>
              <span className="text-primary text-2xl font-black animate-pulse">!</span>
              <span className="text-white text-2xl font-black font-headline uppercase italic">anime</span>
            </Link>
          </div>

          {/* Center Section: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-[700px] relative" ref={searchRef}>
            <div className={cn(
              "flex items-center bg-white/[0.03] border transition-all duration-500 rounded-[20px] h-12 w-full group overflow-hidden pl-4 pr-2",
              isFocused ? "border-primary/50 bg-white/[0.06] shadow-[0_0_30px_rgba(147,51,234,0.15)] ring-4 ring-primary/5" : "border-white/10 hover:border-white/20"
            )}>
              <Search className={cn("w-5 h-5 transition-colors duration-500", isFocused ? "text-primary" : "text-white/20")} />
              <input
                type="text"
                placeholder="Search your favorite anime..."
                className="flex-1 bg-transparent border-none px-4 text-white text-[15px] focus:ring-0 placeholder:text-white/20 font-bold tracking-tight"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsFocused(true);
                  if (searchQuery.length >= 2) setShowSuggestions(true);
                }}
                onBlur={() => setIsFocused(false)}
              />
              
              <div className="flex items-center gap-3">
                <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white/30 uppercase tracking-widest">
                  <kbd className="font-sans">⌘</kbd>
                  <kbd className="font-sans">K</kbd>
                </div>
                
                <div className="h-6 w-px bg-white/10 mx-1" />
                
                <button className="h-9 px-4 rounded-xl bg-white/5 hover:bg-primary hover:text-black text-white/60 text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-white/5 hover:border-primary group/filter">
                  <SlidersHorizontal className="w-3.5 h-3.5 group-hover/filter:rotate-180 transition-transform duration-500" />
                  <span className="hidden lg:inline">Filter</span>
                </button>
              </div>
            </div>
            {renderSuggestions()}
          </div>

          {/* Utility Nav Group */}
          <div className="hidden lg:flex items-center gap-3">
            {[
              { label: 'Watch Party', href: '/watch-together', icon: Users },
              { label: 'Random', href: '/random', icon: Shuffle },
              { label: 'News', href: '/news', icon: Newspaper },
              { label: 'Community', href: '/community', icon: MessageCircle },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-primary bg-white/5 rounded-xl border border-white/5 transition-all group relative"
                title={item.label}
              >
                <item.icon className="w-[18px] h-[18px] transition-all group-hover:scale-110" />
              </Link>
            ))}
          </div>

          {/* Right Section: User & Notifications */}
          <div className="flex items-center gap-4">

            <div className="flex items-center gap-3">
              {/* Mobile Search Icon */}
              <button className="md:hidden w-11 h-11 flex items-center justify-center text-white/60 hover:text-primary bg-white/5 rounded-xl border border-white/5 transition-all" onClick={() => setMobileSearchOpen(true)}>
                <Search className="w-5 h-5" />
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <NotificationBell />
                  <div className="h-8 w-px bg-white/5 mx-1" />
                  <UserNav />
                </div>
              ) : (
                <AuthTrigger>
                  <button className="bg-primary text-black font-[1000] text-[12px] px-4 sm:px-8 py-3 rounded-xl hover:bg-white active:scale-95 transition-all uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(147,51,234,0.3)]">
                    Login
                  </button>
                </AuthTrigger>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full bg-[#0B0C10] z-[120] pb-6 border-b border-white/10 shadow-2xl" 
              ref={mobileSearchRef}
            >
              <div className="flex items-center px-4 h-[80px] w-full gap-4">
                <div className={cn(
                  "relative flex-1 flex items-center h-12 bg-white/5 border border-white/10 rounded-xl px-4",
                  isFocused && "border-primary/50 ring-2 ring-primary/10"
                )}>
                  <Search className="w-4 h-4 text-white/20 mr-3" />
                  <input 
                    autoFocus 
                    type="text" 
                    placeholder="Search anime..." 
                    className="flex-1 bg-transparent border-none text-white placeholder:text-white/20 font-bold focus:ring-0" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                </div>
                <button onClick={() => setMobileSearchOpen(false)} className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-white bg-white/5 rounded-xl border border-white/5 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="px-0">{renderSuggestions(true)}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
