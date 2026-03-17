'use client';

import Link from 'next/link';
import { 
  Zap, Github, Twitter, MessageCircle, Mail, ExternalLink, 
  Tv, BookOpen, Compass, Trophy, Grid, Layers, Shuffle, 
  BarChart2, List, Calendar, Sparkles, Shield, Info, HelpCircle,
  Search, MessageSquare
} from 'lucide-react';
import { useHasMounted } from '@/hooks/useHasMounted';

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { href: '/seasonal', label: 'Seasonal Anime', icon: Tv },
      { href: '/discover', label: 'Decade Explore', icon: Compass },
      { href: '/search?type=manga', label: 'Manga Library', icon: BookOpen },
      { href: '/search', label: 'Advanced Search', icon: Search },
    ]
  },
  {
    title: 'Features',
    links: [
      { href: '/bingo', label: 'Anime Bingo', icon: Grid },
      { href: '/quiz', label: 'Trivia Quizzes', icon: Trophy },
      { href: '/quotes', label: 'Iconic Quotes', icon: MessageSquare },
      { href: '/tier-list', label: 'Tier List Maker', icon: Layers },
      { href: '/randomizer', label: 'Anime Randomizer', icon: Shuffle },
    ]
  },
  {
    title: 'Resources',
    links: [
      { href: '/faq', label: 'Help Center', icon: HelpCircle },
      { href: '/about', label: 'About Void', icon: Info },
      { href: '/privacy-policy', label: 'Privacy Policy', icon: Shield },
      { href: '/terms-of-service', label: 'Terms of Service', icon: ExternalLink },
      { href: '/sitemap.xml', label: 'Sitemap', icon: List },
    ]
  }
];

export function Footer() {
  const hasMounted = useHasMounted();

  return (
    <footer className="w-full bg-[var(--color-dark-bg)] border-t border-white/5 mt-6 sm:mt-8 relative z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-anime-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="w-full px-6 md:px-10 lg:px-12 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Branding Column */}
            <div className="lg:col-span-4 space-y-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-anime-primary to-anime-secondary flex items-center justify-center shadow-lg shadow-anime-primary/20 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-white fill-current" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-white font-heading">
                  VOID<span className="text-anime-primary">ANIME</span>
                </span>
              </Link>
              
              <p className="text-sm text-zinc-500 font-bold leading-relaxed max-w-sm">
                The ultimate nexus for anime and manga enthusiasts. Track your journey, play immersive community games, and discover your next obsession with our advanced data-driven platform.
              </p>

              <div className="flex items-center gap-4">
                <a href="https://github.com" target="_blank" rel="noopener" className="p-3 glass-panel rounded-xl text-zinc-400 hover:text-white hover:border-anime-primary/50 transition-all">
                  <Github size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener" className="p-3 glass-panel rounded-xl text-zinc-400 hover:text-white hover:border-anime-cyan/50 transition-all">
                  <Twitter size={20} />
                </a>
                <a href="https://discord.com" target="_blank" rel="noopener" className="p-3 glass-panel rounded-xl text-zinc-400 hover:text-white hover:border-anime-primary/50 transition-all">
                  <MessageCircle size={20} />
                </a>
                <a href="mailto:contact@voidanime.com" className="p-3 glass-panel rounded-xl text-zinc-400 hover:text-white hover:border-anime-secondary/50 transition-all">
                  <Mail size={20} />
                </a>
              </div>

              {/* Newsletter UI */}
              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-anime-primary">Stay Synchronized</p>
                <div className="flex gap-2 max-w-xs">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-anime-primary outline-none transition-all font-bold"
                  />
                  <button className="px-4 py-2.5 bg-anime-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-anime-primary/20 hover:scale-105 active:scale-95 transition-all">
                    Link
                  </button>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
              {FOOTER_LINKS.map((section) => (
                <div key={section.title} className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-2">
                    <span className="w-4 h-px bg-zinc-800" /> {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link 
                          href={link.href} 
                          className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                        >
                          <link.icon className="w-4 h-4 opacity-0 -ml-7 group-hover:opacity-100 group-hover:ml-0 transition-all text-anime-primary" />
                          <span className="text-sm font-bold">{link.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
            <div className="flex items-center gap-8">
              <span>© {new Date().getFullYear()} VOIDANIME</span>
              <span className="flex items-center gap-2 text-zinc-800">
                <Sparkles className="w-3 h-3" /> 10,245 TITLES INDEXED
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookies</Link>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500/50">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
