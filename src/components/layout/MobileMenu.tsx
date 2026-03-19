'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  X, Home, Flame, Sparkles, BookOpen, Search, 
  MessageCircle, Users, Shuffle, Newspaper, 
  Github, Twitter, Instagram, Youtube, User,
  ChevronRight, LogOut, Settings, LayoutDashboard,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { cn } from '@/lib/utils';
import { AuthTrigger } from '../auth/AuthTrigger';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useSupabaseAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      onClose();
    }
  };

  const navLinks = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Trending', href: '/category/trending', icon: Flame },
    { name: 'Latest', href: '/category/recently-updated', icon: Sparkles },
    { name: 'AZ List', href: '/azlist', icon: BookOpen },
    { name: 'Community', href: '/community', icon: MessageCircle },
    { name: 'Watch Together', href: '/watch-together', icon: Users },
    { name: 'Random Anime', href: '/random', icon: Shuffle },
    { name: 'Anime News', href: '/news', icon: Newspaper },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', color: 'hover:text-[#1DA1F2]' },
    { icon: Instagram, href: '#', color: 'hover:text-[#E1306C]' },
    { icon: Youtube, href: '#', color: 'hover:text-[#FF0000]' },
    { icon: Github, href: '#', color: 'hover:text-white' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150]"
          />

          {/* Side Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0B0C10] z-[160] flex flex-col shadow-2xl border-l border-white/5"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white tracking-tighter">void</span>
                <span className="text-2xl font-black text-primary">!</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-white/40 hover:text-white bg-white/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search anime..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary/50 placeholder:text-white/20 text-sm font-medium transition-all"
                />
              </form>

              {/* Navigation Links */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-2">Main Menu</p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href} 
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl transition-all group",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-white/40 group-hover:text-white")} />
                        <span className="text-[14px] font-bold uppercase tracking-widest">{link.name}</span>
                      </div>
                      <ChevronRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", isActive ? "text-primary" : "text-white/20")} />
                    </Link>
                  );
                })}
              </div>

              {/* User Section (Mobile) */}
              <div className="pt-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 ml-2">Account</p>
                {user ? (
                  <div className="space-y-2">
                    <Link 
                      href="/profile" 
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
                        {user.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user.user_metadata?.username || user.email}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">Premium Member</p>
                      </div>
                    </Link>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Link href="/dashboard" onClick={onClose} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                        <LayoutDashboard className="w-5 h-5 text-white/40 group-hover:text-primary mb-2 transition-colors" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white">Dashboard</span>
                      </Link>
                      <Link href="/watchlist" onClick={onClose} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                        <Heart className="w-5 h-5 text-white/40 group-hover:text-primary mb-2 transition-colors" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-white">Watchlist</span>
                      </Link>
                    </div>

                    <button 
                      onClick={() => { signOut(); onClose(); }}
                      className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all font-bold uppercase tracking-widest text-xs"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AuthTrigger>
                      <button className="w-full py-4 bg-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-[1.02] transition-all active:scale-[0.98]">
                        Join the Void
                      </button>
                    </AuthTrigger>
                    <AuthTrigger>
                      <button className="w-full py-4 bg-white/5 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                        Login
                      </button>
                    </AuthTrigger>
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Socials */}
            <div className="p-8 border-t border-white/5 bg-black/40">
              <div className="flex items-center justify-center gap-6 mb-6">
                {socialLinks.map((social, idx) => (
                  <a key={idx} href={social.href} className={cn("text-white/20 transition-all duration-300 hover:scale-125", social.color)}>
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <p className="text-center text-[10px] font-black text-white/10 uppercase tracking-[0.4em]">
                &copy; 2024 VoidAnime. All Rights Reserved.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
