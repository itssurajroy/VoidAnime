'use client';

import { Image as ImageIcon, PaintBucket } from 'lucide-react';
import Image from 'next/image';

export function GalleryTab({ media }: { media: any }) {
  const images = [
    { url: media.coverImage.extraLarge, type: 'Poster' },
    { url: media.bannerImage || media.coverImage.extraLarge, type: 'Banner' },
  ].filter(img => img.url);

  return (
    <div className="space-y-12 animate-slide-up">
      <div className="flex items-center gap-3 px-2 mb-6 text-anime-primary">
        <ImageIcon className="w-6 h-6 fill-current" />
        <h2 className="text-2xl font-heading font-black text-white">Visual Art & Gallery</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img, i) => (
          <div key={i} className="group relative rounded-3xl overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A]/40 aspect-video md:aspect-auto md:h-80 shadow-xl">
            <Image src={img.url} alt={img.type} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                {img.type}
              </span>
            </div>
          </div>
        ))}
      </div>

      {media.coverImage?.color && (
        <div className="p-8 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <PaintBucket className="w-5 h-5 text-zinc-400" />
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-300">Dominant Color Palette</h3>
          </div>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl shadow-inner border border-[#2A2A2A]" 
              style={{ backgroundColor: media.coverImage.color }}
            />
            <div>
              <p className="text-lg font-black text-white">{media.coverImage.color.toUpperCase()}</p>
              <p className="text-[10px] text-zinc-400 font-mono uppercase">Primary Hex</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
