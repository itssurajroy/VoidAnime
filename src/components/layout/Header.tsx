'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, KeyboardEvent, useEffect } from 'react';
import { Search, Menu, X, PlayCircle, Flame, Sparkles, BookOpen } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { AuthTrigger } from '../auth/AuthTrigger';
import { UserNav } from './UserNav';
import { NotificationBell } from './NotificationBell';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const navLinks = [
    { name: 'Home', href: '/home', icon: PlayCircle },
    { name: 'Trending', href: '/category/trending', icon: Flame },
    { name: 'Latest', href: '/category/recently-updated', icon: Sparkles },
    { name: 'AZ List', href: '/azlist', icon: BookOpen },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 w-full z-[100] transition-all duration-500 ease-in-out px-4 md:px-10",
          scrolled 
            ? "h-16 glass-morphism border-b border-white/10" 
            : "h-24 bg-transparent"
        )}
      >
        <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between gap-4">
          
          {/* Branding */}
          <div className="flex items-center gap-12">
            <Link href="/" className="group flex items-center relative z-[110]">
              <span className="text-3xl font-black text-white tracking-tighter transition-transform group-hover:scale-105">void</span>
              <span className="text-3xl font-black text-primary group-hover:animate-bounce">!</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all duration-300",
                      isActive 
                        ? "text-primary" 
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-4 right-4 h-0.5 bg-primary shadow-[0_0_10px_rgba(147,51,234,0.8)]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Actions Section */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1 justify-end">
            
            {/* High-End Search Bar */}
            <div className="relative hidden md:flex items-center group">
              <motion.div 
                initial={false}
                animate={{ 
                  width: isSearchFocused ? 320 : 220,
                  borderColor: isSearchFocused ? 'rgba(147, 51, 234, 0.5)' : 'rgba(255, 255, 255, 0.1)'
                }}
                className="relative flex items-center bg-white/[0.03] backdrop-blur-md border rounded-full overflow-hidden transition-all duration-500"
              >
                <div className={cn(
                  "pl-4 transition-colors duration-300",
                  isSearchFocused ? "text-primary" : "text-white/40"
                )}>
                  <Search className="w-4 h-4" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search your favorite anime..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="bg-transparent border-none text-[13px] text-white px-3 py-2.5 w-full focus:outline-none placeholder:text-white/20 font-medium"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={handleSearch}
                      className="mr-2 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-tighter rounded-full hover:bg-primary/90 transition-colors"
                    >
                      Search
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* User Controls */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <NotificationBell />
                  <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                  <UserNav />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AuthTrigger>
                    <button className="hidden sm:block text-white/60 hover:text-white text-xs font-black uppercase tracking-widest px-4 py-2 transition-colors">
                      Login
                    </button>
                  </AuthTrigger>
                  <AuthTrigger>
                    <button className="relative group px-6 py-2.5 rounded-full bg-primary text-white text-xs font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative z-10">Sign In</span>
                      {/* Neon Glow */}
                      <div className="absolute inset-0 shadow-[0_0_20px_rgba(147,51,234,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </AuthTrigger>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all active:scale-90"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overhauled Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}
