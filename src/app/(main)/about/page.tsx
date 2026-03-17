'use client';

import { Sparkles, Zap, Users, Globe, Heart, Github, Twitter, Mail, ChevronRight, Star, Shield, TrendingUp, Compass } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-anime-primary to-anime-secondary mb-6 shadow-lg shadow-anime-primary/30">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6">
            About <span className="text-anime-primary">VoidAnime</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            The ultimate destination for tracking your anime and manga journey. 
            Built with love for fans, by a fan.
          </p>
        </div>

        {/* What is VoidAnime */}
        <section className="mb-20">
          <div className="p-8 md:p-12 rounded-[40px] bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-6 flex items-center gap-3">
              <Zap className="w-8 h-8 text-anime-primary" />
              What is VoidAnime?
            </h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed">
              <p>
                VoidAnime is a free anime and manga tracking platform built for fans who want to organize their 
                watchlist, discover new series, and connect with the community. Unlike other trackers, VoidAnime 
                combines powerful tracking features with modern design and innovative community features.
              </p>
              <p>
                Whether you&apos;re just starting your anime journey or you&apos;re a seasoned veteran with hundreds 
                of completed series, VoidAnime helps you keep track of everything in one beautiful, easy-to-use interface.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {[
                { icon: TrendingUp, title: 'Advanced Stats', desc: 'Deep analytics about your watching habits' },
                { icon: Users, title: 'Community Features', desc: 'Compare lists, tier lists, bingo games' },
                { icon: Compass, title: 'Smart Discovery', desc: 'Find your next favorite series through advanced filters' },
                { icon: Heart, title: 'Social Tracking', desc: 'Share progress with friends' },
                { icon: Globe, title: 'Real-time Data', desc: 'Powered by AniList, Jikan, Kitsu' },
                { icon: Shield, title: 'Privacy First', desc: 'Your data, your control' },
              ].map((feature, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A] hover:border-anime-primary/30 transition-colors">
                  <feature.icon className="w-6 h-6 text-anime-primary mb-3" />
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-zinc-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who Built It */}
        <section className="mb-20">
          <div className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-anime-primary/10 to-anime-secondary/10 border border-[#2A2A2A]">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-anime-primary" />
              Who Built VoidAnime?
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-anime-primary to-anime-secondary flex items-center justify-center shrink-0 shadow-lg shadow-anime-primary/30">
                <span className="text-3xl font-black text-white">V</span>
              </div>
              <div className="space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  VoidAnime was built by a developer and anime fan based in India. This project started as a 
                  personal tool to track my own watchlist and quickly grew into something much bigger.
                </p>
                <p>
                  I wanted to create a tracker that was different from the rest — one that combined powerful 
                  features with a beautiful, modern interface. Something that felt as good to use as the anime 
                  it helps you track.
                </p>
                <p>
                  Every feature in VoidAnime was built with the anime community in mind, based on feedback 
                  from fellow fans who wanted a better way to manage their journey through the vast world 
                  of anime and manga.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-20">
          <div className="p-8 md:p-12 rounded-[40px] bg-[#1A1A1A]/40 border border-[#2A2A2A]">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-6 flex items-center gap-3">
              <Globe className="w-8 h-8 text-anime-primary" />
              Our Data Sources
            </h2>
            <p className="text-zinc-300 mb-8">
              VoidAnime doesn&apos;t host any anime or manga content. All data is sourced from trusted, 
              community-driven APIs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'AniList', desc: 'Primary database for anime & manga metadata, user lists' },
                { name: 'Jikan API', desc: 'MyAnimeList data including schedules and reviews' },
                { name: 'Kitsu API', desc: 'Additional metadata and cross-referencing' },
                { name: 'MangaDex', desc: 'Live chapter counts for manga tracking' },
              ].map((source, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A]">
                  <h3 className="font-bold text-white mb-2">{source.name}</h3>
                  <p className="text-sm text-zinc-500">{source.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-400">
                <strong>Important:</strong> VoidAnime is not affiliated with, endorsed by, or connected to 
                any anime studios, publishers, or streaming services. All anime and manga content referenced 
                on this site is the property of its respective copyright holders.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-20">
          <div className="p-8 md:p-12 rounded-[40px] bg-[#1A1A1A]/40 border border-[#2A2A2A] text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Our goal is to be the most feature-rich free anime tracker available — combining watchlist 
              management, AI recommendations, community features, and discovery tools in one powerful platform.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-[#212121]">
                <Star className="w-8 h-8 text-anime-primary mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">For Fans</h3>
                <p className="text-sm text-zinc-500">Built by fans, for fans</p>
              </div>
              <div className="p-6 rounded-2xl bg-[#212121]">
                <Zap className="w-8 h-8 text-anime-primary mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Always Free</h3>
                <p className="text-sm text-zinc-500">No paywalls, no premium</p>
              </div>
              <div className="p-6 rounded-2xl bg-[#212121]">
                <Heart className="w-8 h-8 text-anime-primary mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">Community Driven</h3>
                <p className="text-sm text-zinc-500">Your feedback shapes us</p>
              </div>
            </div>
          </div>
        </section>

        {/* Connect */}
        <section className="mb-20">
          <div className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-anime-primary/10 to-anime-secondary/10 border border-[#2A2A2A]">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-6 text-center">
              Get In Touch
            </h2>
            <p className="text-zinc-400 text-center mb-8">
              Have questions, suggestions, or just want to say hi? We&apos;d love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-anime-primary text-white font-bold hover:shadow-lg hover:shadow-anime-primary/30 transition-all"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </Link>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
              >
                <Twitter className="w-5 h-5" />
                Follow on X
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-zinc-400 mb-8">
            Join thousands of anime fans tracking their journey with VoidAnime.
          </p>
          <Link 
            href="/discover"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-anime-primary to-anime-secondary text-white font-bold hover:shadow-lg hover:shadow-anime-primary/30 transition-all"
          >
            Discover Anime
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-[#2A2A2A] text-center">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} VoidAnime. Made with ❤️ for the anime community.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/privacy-policy" className="text-zinc-400 hover:text-anime-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-zinc-400 hover:text-anime-primary text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-zinc-400 hover:text-anime-primary text-sm transition-colors">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-zinc-400 hover:text-anime-primary text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
