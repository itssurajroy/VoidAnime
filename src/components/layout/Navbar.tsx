'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { 
  Search, Menu, X, List, Tv, BarChart2, Calendar, Users, Zap, Bell, 
  Sparkles, Layers, ChevronDown, BookOpen, Home, User, 
  Wind, Compass, Image as ImageIcon, Heart, Grid, Trophy, MessageSquare, Shuffle, Filter, ArrowRight, Settings, Edit2, Activity, Crown
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { signOut } from '@/lib/firebase/auth';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelBadge } from '@/components/gamification/LevelBadge';
import { DailyStreak } from '@/components/gamification/DailyStreak';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useKeyPress } from '@/hooks/useKeyPress';

const MEGA_MENU = [
  {
    label: 'Discover',
    icon: Compass,
    color: 'text-anime-cyan',
    bg: 'bg-anime-cyan/10',
    description: 'Explore the vast world of anime & manga',
    links: [
      { href: '/seasonal', label: 'Seasonal Anime', desc: 'Current season hits', icon: Wind },
      { href: '/discover', label: 'Decade Explore', desc: 'Travel through time', icon: Compass },
      { href: '/search?type=manga', label: 'Manga Library', desc: 'Deep-dive into panels', icon: BookOpen },
      { href: '/search', label: 'Advanced Search', desc: 'Find your exact taste', icon: Search },
    ],
    featured: {
      title: 'Trending Now',
      items: ['Solo Leveling', 'One Piece', 'JJK']
    }
  },
  {
    label: 'Playroom',
    icon: Trophy,
    color: 'text-anime-primary',
    bg: 'bg-anime-primary/10',
    description: 'Games and community tools',
    links: [
      { href: '/bingo', label: 'Anime Bingo', desc: 'Watch party challenges', icon: Grid },
      { href: '/quiz', label: 'Trivia Quizzes', desc: 'Test your knowledge', icon: Trophy },
      { href: '/quotes', label: 'Iconic Quotes', desc: 'Memorable moments', icon: MessageSquare },
      { href: '/tier-list', label: 'Tier List Maker', desc: 'Rank your favorites', icon: Layers },
      { href: '/randomizer', label: 'Anime Randomizer', desc: 'Fate decides your watch', icon: Shuffle },
    ]
  },
  {
    label: 'Track',
    icon: List,
    color: 'text-anime-secondary',
    bg: 'bg-anime-secondary/10',
    description: 'Manage your anime journey',
    links: [
      { href: '/list', label: 'My Watchlist', desc: 'Your personal library', icon: List },
      { href: '/stats', label: 'My Statistics', desc: 'Data-driven insights', icon: BarChart2 },
      { href: '/calendar', label: 'Airing Calendar', desc: 'Never miss an episode', icon: Calendar },
      { href: '/onboarding', label: 'Taste Profile', desc: 'Personalize discovery', icon: Compass },
    ]
  },
  {
    label: 'Community',
    icon: MessageSquare,
    color: 'text-anime-accent',
    bg: 'bg-anime-accent/10',
    description: 'Connect with fellow otaku',
    links: [
      { href: '/feed', label: 'Global Feed', desc: 'Real-time reviews', icon: Activity },
      { href: '/blog', label: 'Blog', desc: 'Latest news & articles', icon: BookOpen },
      { href: '/achievements', label: 'Achievements', desc: 'Your unlocked badges', icon: Crown },
      { href: '/compare', label: 'Compare', desc: 'Match with friends', icon: Users },
      { href: '/compatibility', label: 'Compatibility', desc: 'Find your match', icon: Heart },
    ]
  }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchFilters, setShowFilters] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const hasMounted = useHasMounted();
  const { firebaseUser } = useUserStore();

  useClickOutside(dropdownRef, () => setActiveMega(null));
  useClickOutside(searchRef, () => setShowFilters(false));
  useKeyPress('Escape', () => {
    setActiveMega(null);
    setMobileOpen(false);
    setShowFilters(false);
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowFilters(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b glass-navbar py-3 md:py-4"
      >
        <div className="w-full flex items-center justify-between px-6 md:px-10 lg:px-12">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex-1 flex justify-start">
            <button
              className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-300 hover:text-white"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start gap-8 xl:gap-12 flex-1 md:flex-none">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-anime-primary to-anime-secondary shadow-lg shadow-anime-primary/20 group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5 text-white fill-current" />
              </div>
              <span className="text-xl xl:text-2xl font-black tracking-tighter text-white font-heading">
                VOID<span className="text-anime-primary">ANIME</span>
              </span>
            </Link>

            {/* Desktop Mega Menu Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {MEGA_MENU.map((menu) => (
                <div 
                  key={menu.label}
                  className="relative h-full py-2"
                  onMouseEnter={() => setActiveMega(menu.label)}
                  onMouseLeave={() => setActiveMega(null)}
                >
                  <button
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs xl:text-sm font-black uppercase tracking-widest transition-all ${
                      activeMega === menu.label ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{menu.label}</span>
                    <ChevronDown className={`h-3 w-3 transition-transform ${activeMega === menu.label ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeMega === menu.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="absolute top-full left-0 w-[600px] lg:w-[700px] glass-dropdown rounded-[32px] p-8 mt-2 shadow-2xl overflow-hidden border-white/5"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-anime-primary/5 via-transparent to-transparent pointer-events-none" />
                        <div className="relative z-10 grid grid-cols-12 gap-8">
                          {/* Sidebar Info */}
                          <div className="col-span-4 space-y-4 pr-8 border-r border-white/5">
                            <div className={`w-12 h-12 rounded-2xl ${menu.bg} ${menu.color} flex items-center justify-center shadow-lg`}>
                              <menu.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-heading font-black text-white">{menu.label}</h3>
                            <p className="text-xs text-zinc-500 font-bold leading-relaxed">{menu.description}</p>
                            {menu.featured && (
                              <div className="pt-4 space-y-2">
                                <span className="text-[10px] font-black uppercase text-anime-primary tracking-widest">{menu.featured.title}</span>
                                <div className="flex flex-col gap-1">
                                  {menu.featured.items.map(i => (
                                    <span key={i} className="text-[10px] font-bold text-zinc-400"># {i}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Grid of Links */}
                          <div className="col-span-8 grid grid-cols-2 gap-4">
                            {menu.links.map((link) => (
                              <Link 
                                key={link.href} 
                                href={link.href}
                                onClick={() => setActiveMega(null)}
                                className="group/link flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all"
                              >
                                <div className="mt-1 p-2 rounded-xl bg-white/5 group-hover/link:bg-anime-primary group-hover/link:text-white transition-all text-zinc-500">
                                  <link.icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="block text-sm font-black text-white group-hover/link:text-anime-primary transition-colors">{link.label}</span>
                                  <span className="block text-[10px] text-zinc-500 font-bold mt-0.5">{link.desc}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-8 xl:mx-12" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="relative flex items-center bg-white/5 border border-white/10 focus-within:border-anime-primary/50 rounded-xl px-4 py-2.5 transition-all shadow-xl">
                <Search className="w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick Search Anime..."
                  className="bg-transparent text-sm text-white px-3 w-full outline-none placeholder:text-zinc-600 font-medium"
                />
                <button type="button" onClick={() => setShowFilters(!showSearchFilters)} className={`p-1 rounded-lg transition-all ${showSearchFilters ? 'text-anime-primary' : 'text-zinc-500 hover:text-white'}`}>
                  <Filter className="w-4 h-4" />
                </button>
              </div>
              
              <AnimatePresence>
                {showSearchFilters && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 glass-dropdown rounded-2xl p-6 shadow-2xl z-[110]"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span>Advanced Filters</span>
                        <Link href="/discover" className="text-anime-primary hover:text-white">Full View →</Link>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {['TV', 'Movie', 'OVA', 'ONA'].map(f => (
                          <button key={f} onClick={() => router.push(`/search?format=${f}`)} className="py-2 rounded-lg bg-black/40 border border-white/5 text-[9px] font-black hover:border-anime-primary/50 transition-all">{f}</button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {hasMounted && firebaseUser && (
              <div className="hidden xl:flex items-center gap-4 px-4 h-12 rounded-2xl bg-white/5 border border-white/5 mr-2">
                <DailyStreak streak={12} />
                <div className="w-px h-4 bg-white/10" />
                <LevelBadge level={47} xp={2350} />
              </div>
            )}
            
            <ThemeToggle />
            
            <div className="relative group">
              {hasMounted && firebaseUser ? (
                <>
                  <button className="flex items-center gap-2 p-1 min-h-[44px] min-w-[44px] rounded-full border border-white/10 bg-[#212121] hover:border-anime-primary transition-all">
                    <Image src={firebaseUser.photoURL || '/avatar-placeholder.png'} alt="U" width={32} height={32} className="rounded-full" />
                  </button>
                  <div className="invisible absolute right-0 top-12 w-64 glass-dropdown rounded-2xl p-2 opacity-0 group-hover:visible group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <div className="p-4 border-b border-white/5 mb-2">
                      <p className="text-sm font-black text-white truncate">{firebaseUser.displayName}</p>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Free Member</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-bold text-zinc-300"><User className="w-4 h-4" /> My Profile</Link>
                    <Link href="/list" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-bold text-zinc-300"><List className="w-4 h-4" /> My Watchlist</Link>
                    <Link href="/stats" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-bold text-zinc-300"><BarChart2 className="w-4 h-4" /> Statistics</Link>
                    <div className="my-2 border-t border-white/5" />
                    <Link href="/profile/edit" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-bold text-zinc-300"><Edit2 className="w-4 h-4" /> Edit Profile</Link>
                    <Link href="/profile/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-bold text-zinc-300"><Settings className="w-4 h-4" /> Settings</Link>
                    <div className="my-2 border-t border-white/5" />
                    <button onClick={handleSignOut} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-sm font-bold text-red-400 w-full mt-2"><X className="w-4 h-4" /> Sign Out</button>
                  </div>
                </>
              ) : (
                <Link href="/login" className="px-6 py-2.5 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-anime-primary hover:text-white transition-all">Sign In</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Hub - Slide Up */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md md:hidden" onClick={() => setMobileOpen(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} onClick={e => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto glass-panel rounded-t-[40px] border-t border-white/10 pb-20"
            >
              <div className="sticky top-0 z-10 glass-navbar p-6 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-anime-primary flex items-center justify-center"><Compass className="w-4 h-4 text-white" /></div>
                  <span className="font-heading font-black text-xl text-white">Platform Hub</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-3 bg-white/5 rounded-2xl"><X className="w-6 h-6 text-white" /></button>
              </div>

              <div className="p-6 space-y-10">
                {MEGA_MENU.map((menu) => (
                  <div key={menu.label} className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">{menu.label}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {menu.links.map(link => (
                        <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-transparent active:border-anime-primary/30">
                          <link.icon className="w-5 h-5 text-anime-primary" />
                          <span className="font-heading font-bold text-lg text-zinc-200">{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[150] glass-navbar border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16">
          <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-anime-primary' : 'text-zinc-500'}`}><Home className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Home</span></Link>
          <Link href="/list" className={`flex flex-col items-center gap-1 ${pathname === '/list' ? 'text-anime-primary' : 'text-zinc-500'}`}><List className="w-6 h-6" /><span className="text-[8px] font-black uppercase">List</span></Link>
          <button onClick={() => setMobileOpen(true)} className="flex flex-col items-center gap-1 text-zinc-500"><Compass className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Hub</span></button>
          <Link href="/quiz" className={`flex flex-col items-center gap-1 ${pathname === '/quiz' ? 'text-anime-primary' : 'text-zinc-500'}`}><Trophy className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Quiz</span></Link>
          {hasMounted && firebaseUser ? (
            <Link href="/profile" className={`flex flex-col items-center gap-1 ${pathname?.startsWith('/profile') ? 'text-anime-primary' : 'text-zinc-500'}`}><User className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Profile</span></Link>
          ) : (
            <Link href="/login" className={`flex flex-col items-center gap-1 ${pathname === '/login' ? 'text-anime-primary' : 'text-zinc-500'}`}><User className="w-6 h-6" /><span className="text-[8px] font-black uppercase">Profile</span></Link>
          )}
        </div>
      </nav>
    </>
  );
}
