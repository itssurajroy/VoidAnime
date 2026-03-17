'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { cn } from "@/lib/utils";

interface CatalogHeroProps {
  title: string;
  subtitle: string;
  breadcrumbLabel: string;
  breadcrumbHref?: string;
  name: string; // Used for banner logic
}

const BANNER_MAP: Record<string, string> = {
  'action': 'https://images.alphacoders.com/605/605729.jpg',
  'adventure': 'https://images.alphacoders.com/134/1341101.png',
  'comedy': 'https://images.alphacoders.com/133/1330687.png',
  'drama': 'https://images.alphacoders.com/132/1327310.png',
  'fantasy': 'https://images.alphacoders.com/132/1322514.png',
  'horror': 'https://images.alphacoders.com/691/691082.jpg',
  'romance': 'https://images.alphacoders.com/132/1327310.png',
  'sci-fi': 'https://images.alphacoders.com/132/1322514.png',
  'shounen': 'https://images.alphacoders.com/605/605729.jpg',
  'seinen': 'https://images.alphacoders.com/134/1341101.png',
  'movie': 'https://images.alphacoders.com/132/1327310.png',
  'tv': 'https://images.alphacoders.com/605/605729.jpg',
  'most-popular': 'https://images.alphacoders.com/134/1341101.png',
  'top-airing': 'https://images.alphacoders.com/133/1330687.png',
};

const DEFAULT_BANNER = 'https://images.alphacoders.com/134/1341101.png';

export function CatalogHero({ title, subtitle, breadcrumbLabel, breadcrumbHref, name }: CatalogHeroProps) {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const bannerUrl = BANNER_MAP[slug] || DEFAULT_BANNER;

  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center overflow-hidden border-b border-white/5">
      {/* ─── BACKGROUND ─── */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerUrl}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover saturate-[1.2] brightness-[0.4]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10] via-transparent to-[#0B0C10]/40" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="container max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 relative z-10 pt-20">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Breadcrumbs items={breadcrumbHref ? [{ label: breadcrumbLabel, href: breadcrumbHref }, { label: title }] : [{ label: title }]} />
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-4"
            >
              <div className="w-1.5 h-12 bg-primary rounded-full shadow-[0_0_20px_#9333ea]" />
              <h1 className="text-5xl md:text-7xl font-[1000] text-white uppercase tracking-tighter italic font-headline leading-none">
                {title}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/40 text-sm md:text-base font-black uppercase tracking-[0.4em] max-w-2xl leading-relaxed italic"
            >
              {subtitle}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
    </div>
  );
}
