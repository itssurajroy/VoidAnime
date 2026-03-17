'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Send, ChevronUp, Twitter, MessageCircle, Mail, Rss, Github,
  Instagram, Youtube, Facebook, LucideIcon, Globe, Shield, Heart,
  Gamepad2, MessageSquare, Zap
} from 'lucide-react';
import NextImage from 'next/image';
import { useSiteConfig } from '@/components/SettingsProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const IconMap: Record<string, LucideIcon> = {
  Send,
  Twitter,
  MessageCircle,
  Mail,
  Rss,
  Github,
  Instagram,
  Youtube,
  Facebook,
  Discord: Gamepad2,
  Reddit: MessageSquare,
  Telegram: Send,
};

export function Footer() {
  const pathname = usePathname();
  const { config, loading } = useSiteConfig();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }

  if (loading || !config) return null;

  return (
    <footer className="relative bg-[#0B0C10] pt-32 pb-16 mt-auto overflow-hidden border-t border-white/5">
      {/* ─── ENHANCED BACKGROUND DECOR ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[100vw] sm:w-[600px] h-[400px] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-[100vw] sm:w-[500px] h-[500px] bg-purple-600/5 blur-[150px] rounded-full animate-float" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container max-w-[1920px] mx-auto px-4 md:px-12 lg:px-24 relative z-10">

        {/* ─── TOP SECTION: BRANDING & NAVIGATION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-32">

          {/* Brand Identity */}
          <div className="lg:col-span-5 space-y-10">
            <Link href="/home" className="flex items-center gap-1 w-fit group cursor-pointer transition-transform hover:scale-105">
              <span className="text-white text-5xl font-black tracking-tight font-headline uppercase italic">void</span>
              <span className="text-primary text-5xl font-black animate-pulse">!</span>
              <span className="text-white text-5xl font-black font-headline uppercase italic">anime</span>
            </Link>

            <p className="text-white/40 text-base leading-relaxed max-w-[450px] font-medium selection:bg-primary/30">
              {config.tagline || 'Experience the next generation of anime streaming. HD quality, zero interruptions, and a global community.'}
            </p>

            <div className="flex items-center gap-4">
              {config.socialLinks.map((social) => {
                const Icon = IconMap[social.icon] || Mail;
                return (
                  <Link
                    key={social.id}
                    href={social.url}
                    aria-label={social.name}
                    className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/40 hover:bg-primary hover:text-black hover:border-primary hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all duration-500 hover:-translate-y-2 group"
                  >
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_#9333ea]" />
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Explore</h3>
              </div>
              <ul className="space-y-5">
                {config.navLinks.slice(0, 6).map((link) => (
                  <li key={link.id}>
                    <Link href={link.url} className="text-white/30 hover:text-white text-sm font-black transition-all duration-300 flex items-center gap-3 group uppercase tracking-widest">
                      <div className="w-0 h-1 bg-primary rounded-full group-hover:w-3 transition-all duration-500" />
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_#9333ea]" />
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Company</h3>
              </div>
              <ul className="space-y-5">
                <li><Link href="/terms" className="text-white/30 hover:text-white text-sm font-black transition-all uppercase tracking-widest flex items-center gap-3 group">
                  <div className="w-0 h-1 bg-primary rounded-full group-hover:w-3 transition-all duration-500" />
                  Terms
                </Link></li>
                <li><Link href="/privacy" className="text-white/30 hover:text-white text-sm font-black transition-all uppercase tracking-widest flex items-center gap-3 group">
                  <div className="w-0 h-1 bg-primary rounded-full group-hover:w-3 transition-all duration-500" />
                  Privacy
                </Link></li>
                <li><Link href="/dmca" className="text-white/30 hover:text-white text-sm font-black transition-all uppercase tracking-widest flex items-center gap-3 group">
                  <div className="w-0 h-1 bg-primary rounded-full group-hover:w-3 transition-all duration-500" />
                  DMCA
                </Link></li>
                <li><Link href="/contact" className="text-white/30 hover:text-white text-sm font-black transition-all uppercase tracking-widest flex items-center gap-3 group">
                  <div className="w-0 h-1 bg-primary rounded-full group-hover:w-3 transition-all duration-500" />
                  Contact
                </Link></li>
              </ul>
            </div>

            <div className="space-y-8 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_#9333ea]" />
                <h3 className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Support Us</h3>
              </div>
              <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/10 space-y-4 group hover:border-primary/30 transition-all duration-500">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">Help us keep the servers running and the library updated.</p>
                <Link href="/donate" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-black font-[1000] uppercase tracking-widest text-[10px] hover:bg-white transition-all duration-500 shadow-[0_10px_30px_rgba(147,51,234,0.3)]">
                  <Heart className="w-4 h-4 fill-current" />
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── MIDDLE SECTION: BROWSE A-Z ─── */}
        <div className="relative mb-32 group">
          {/* Glowing Background Wrapper */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="relative p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl overflow-hidden group-hover:border-primary/20 transition-all duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 border-b border-white/5 pb-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(147,51,234,0.2)] group-hover:scale-110 transition-transform duration-700">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-white text-2xl font-black uppercase tracking-tighter leading-none italic">Alphabetical Browse</h2>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Find your favorite series instantly by its first letter</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/azlist/all" className="h-14 px-10 flex items-center justify-center bg-primary text-black rounded-2xl text-xs font-[1000] hover:bg-white transition-all shadow-xl uppercase tracking-widest">Browse All</Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link href="/azlist/0-9" className="h-12 px-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/40 text-[12px] font-black hover:bg-primary hover:text-black hover:border-primary transition-all hover:-translate-y-1 uppercase tracking-widest">0-9</Link>
              {ALPHABET.map((letter) => (
                <Link
                  key={letter}
                  href={`/azlist/${letter.toLowerCase()}`}
                  className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/40 text-sm font-black hover:bg-primary hover:text-black hover:border-primary transition-all hover:-translate-y-1"
                >
                  {letter}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ─── BOTTOM BAR: LEGAL & INFO ─── */}
        <div className="pt-12 border-t border-white/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
              <Link href="/home" className="flex items-center gap-1 opacity-30 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                <span className="text-white text-xl font-black tracking-tight font-headline uppercase italic">void</span>
                <span className="text-primary text-xl font-black">!</span>
                <span className="text-white text-xl font-black font-headline uppercase italic">anime</span>
              </Link>
              <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.3em] text-center md:text-left">
                Copyright © 2026 <span className="text-white/40 italic">{config.siteName}</span> • Visual Production Collective
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <p className="text-white/10 text-[9px] font-bold uppercase tracking-[0.25em] max-w-[450px] text-center lg:text-right leading-loose italic">
                {config.siteName} is a community-driven index. We do not host files; all content is indexed from third-party sources.
              </p>

              <button
                onClick={scrollToTop}
                className="group relative w-16 h-16 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-lg group-hover:bg-primary/20 transition-all" />
                <div className="relative w-full h-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover:text-primary group-hover:border-primary/50 transition-all shadow-2xl">
                  <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                </div>
              </button>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
