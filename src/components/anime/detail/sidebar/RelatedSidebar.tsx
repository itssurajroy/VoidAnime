import Link from 'next/link';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { slugify } from '@/lib/utils/slugify';

interface RelatedSidebarProps {
  relations: Array<{
    id: number;
    relationType: string;
    title: { romaji: string; english?: string };
    coverImage: { medium: string };
    format: string;
  }>;
}

export function RelatedSidebar({ relations }: RelatedSidebarProps) {
  if (!relations || relations.length === 0) return null;

  return (
    <div className="p-8 rounded-[40px] glass-panel shadow-2xl">
      <h3 className="text-[10px] font-black text-zinc-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
        <Share2 className="w-4 h-4 text-purple-400" /> Franchise Links
      </h3>

      <div className="space-y-4">
        {relations.slice(0, 6).map((rel) => {
          const title = rel.title.english || rel.title.romaji;
          const slug = `${slugify(title)}-${rel.id}`;
          
          return (
            <Link
              key={rel.id}
              href={`/anime/${slug}`}
              className="flex items-center gap-4 group"
            >
              <div className="relative w-12 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-anime-primary/30 transition-colors shadow-lg">
                <Image
                  src={rel.coverImage.medium}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] px-1.5 py-0.5 bg-white/5 text-zinc-400 rounded font-black uppercase tracking-tighter">
                    {rel.relationType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">{rel.format}</span>
                </div>
                <p className="text-xs font-bold text-white group-hover:text-anime-primary transition-colors truncate">
                  {title}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
