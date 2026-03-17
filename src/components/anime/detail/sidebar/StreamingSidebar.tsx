import { Play, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface StreamingSidebarProps {
  externalLinks: Array<{
    id: number;
    site: string;
    url: string;
    icon?: string;
    color?: string;
  }>;
}

export function StreamingSidebar({ externalLinks }: StreamingSidebarProps) {
  const streamingLinks = externalLinks?.filter(l => 
    ['Crunchyroll', 'Netflix', 'Hulu', 'Amazon', 'Disney+'].some(site => l.site.includes(site))
  ) || [];

  if (streamingLinks.length === 0) return null;

  return (
    <div className="p-8 rounded-[40px] glass-panel shadow-2xl">
      <h3 className="text-[10px] font-black text-zinc-500 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
        <Play className="w-4 h-4 text-anime-cyan" /> Watch Now
      </h3>

      <div className="space-y-3">
        {streamingLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              {link.icon ? (
                <div className="relative w-5 h-5">
                  <Image src={link.icon} alt={link.site} fill className="object-contain" />
                </div>
              ) : (
                <div className="w-5 h-5 flex items-center justify-center text-anime-cyan">
                  <ExternalLink size={16} />
                </div>
              )}
              <span className="text-xs font-bold text-white group-hover:text-anime-cyan transition-colors">{link.site}</span>
            </div>
            <Play className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
