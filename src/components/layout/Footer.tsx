'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Youtube, Heart, Github, Twitter, MessageSquare } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const links = {
    explore: [
      { name: 'Home', href: '/home' },
      { name: 'Trending', href: '/category/trending' },
      { name: 'Recently Updated', href: '/category/recently-updated' },
      { name: 'AZ List', href: '/azlist' },
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'DMCA', href: '/dmca' },
      { name: 'Contact', href: '/contact' },
    ],
  };

  return (
    <footer className="w-full bg-[#050505] border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-baseline mb-6 group w-fit">
              <span className="text-3xl font-black text-white tracking-tighter">void</span>
              <span className="text-3xl font-black text-primary ml-0.5 group-hover:animate-pulse">!</span>
              <span className="text-3xl font-black text-white tracking-tighter">anime</span>
            </Link>
            <p className="text-white/50 text-[14px] leading-relaxed max-w-md font-medium mb-8">
              VoidAnime is a free streaming platform built for anime fans. Enjoy thousands of subbed and dubbed anime episodes in high quality without disruptive ads. Join our community and keep track of your favorite shows.
            </p>
            
            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: MessageSquare, href: '#' }, // Discord/Community
                { icon: Github, href: '#' },
                { icon: Youtube, href: '#' },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a key={i} href={social.href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-primary hover:text-white transition-all hover:scale-110 border border-white/5">
                    <Icon className="w-[18px] h-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links - Explore */}
          <div>
            <h3 className="text-white font-bold text-[15px] mb-6 tracking-wide">Explore</h3>
            <ul className="flex flex-col gap-3">
              {links.explore.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-primary transition-colors text-[14px] font-medium flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links - Legal */}
          <div>
            <h3 className="text-white font-bold text-[15px] mb-6 tracking-wide">Legal & Help</h3>
            <ul className="flex flex-col gap-3">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/50 hover:text-primary transition-colors text-[14px] font-medium flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-white/30 text-[13px] font-medium">
            © {new Date().getFullYear()} VoidAnime. All rights reserved. Does not store any files on our server.
          </p>
          <div className="flex items-center gap-1.5 text-white/30 text-[13px] font-medium">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-1" /> for anime fans
          </div>
        </div>
      </div>
    </footer>
  );
}
