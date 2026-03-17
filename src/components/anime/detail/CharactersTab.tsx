import Image from 'next/image';
import Link from 'next/link';

export function CharactersTab({ media }: { media: any }) {
  const characters = media.characters?.edges || [];

  if (!characters.length) {
    return <div className="text-center py-20 text-zinc-400">No character data available.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-heading font-black text-white px-2">Cast & Characters</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((edge: any) => {
          const char = edge.node;
          const va = edge.voiceActors?.[0]; // Taking the first VA (usually Japanese)

          return (
            <div key={char.id} className="relative group rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] overflow-hidden flex h-36">
              {/* Character Side */}
              <div className="flex-1 flex items-center gap-4 p-3 relative z-10">
                <div className="relative w-20 h-28 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                  <Image src={char.image.large} alt={char.name.full} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white line-clamp-2">{char.name.full}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-anime-primary mt-1">{edge.role}</p>
                </div>
              </div>

              {/* VA Side (Slanted divider effect) */}
              {va && (
                <div className="w-[45%] relative overflow-hidden bg-[#212121] border-l border-[#2A2A2A] shrink-0">
                  <div className="absolute inset-0 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                    <Image src={va.image.large} alt={va.name.full} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-3 z-10 text-right">
                    <p className="text-xs font-bold text-white line-clamp-1">{va.name.full}</p>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50">Japanese</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
