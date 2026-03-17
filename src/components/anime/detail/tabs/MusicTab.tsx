import { Play, Music, Headphones } from 'lucide-react';
import Image from 'next/image';

export function MusicTab({ media }: { media: any }) {
  // Mock data since AniList doesn't provide full OST/Spotify data directly in standard queries
  const mockThemes = [
    { type: 'OP 1', title: 'SPECIALZ', artist: 'King Gnu', ep: '1-18', image: media.coverImage.large },
    { type: 'ED 1', title: 'more than words', artist: 'Hitsujibungaku', ep: '1-18', image: media.coverImage.large },
  ];

  return (
    <div className="space-y-12 animate-slide-up">
      <h2 className="text-2xl font-heading font-black text-white px-2 flex items-center gap-3">
        <Headphones className="w-6 h-6 text-anime-primary" /> Soundtrack & Themes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 px-2 mb-4">Opening & Ending Themes</h3>
          {mockThemes.map((theme, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-sm group hover:bg-[#212121] transition-all">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#2A2A2A] shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <Image src={theme.image} alt={theme.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-white fill-current ml-1" />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-anime-primary bg-anime-primary/10 border border-anime-primary/20 px-2 py-0.5 rounded-md">
                    {theme.type}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500">EP {theme.ep}</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-anime-accent transition-colors">{theme.title}</h4>
                <p className="text-xs text-white/50 font-medium">{theme.artist}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 px-2 mb-4">Original Soundtrack</h3>
          <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#1DB954]/10 to-transparent border border-[#1DB954]/20 backdrop-blur-sm flex flex-col items-center justify-center text-center h-full min-h-[250px] group overflow-hidden relative">
            <div className="absolute inset-0 bg-[#1DB954]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Music className="w-16 h-16 text-[#1DB954] mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_15px_rgba(29,185,84,0.5)]" />
            <h4 className="text-lg font-black text-white mb-2 relative z-10">Listen on Spotify</h4>
            <p className="text-sm text-white/50 mb-8 relative z-10">The official original soundtrack is available for streaming.</p>
            <button className="px-8 py-4 bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(29,185,84,0.3)] hover:-translate-y-1 relative z-10">
              Open Web Player
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
