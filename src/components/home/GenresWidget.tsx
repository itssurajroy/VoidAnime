import Link from 'next/link';
import { Tag } from 'lucide-react';

export function GenresWidget({ genres }: { genres: string[] }) {
  if (!genres?.length) return null;

  return (
    <div className="w-full bg-[#0a0a0a] rounded-[32px] p-6 sm:p-8 border border-white/5">
      <div className="flex items-center gap-3 mb-8">
        <Tag className="w-6 h-6 text-primary" />
        <h2 className="text-[20px] font-black text-white uppercase tracking-wider">Genres</h2>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {genres.map((genre) => (
          <Link
            key={genre}
            href={`/genre/${genre.toLowerCase().replace(/ /g, '-')}`}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary text-white/70 text-[13px] font-bold transition-all border border-transparent hover:border-primary/30"
          >
            {genre}
          </Link>
        ))}
      </div>
    </div>
  );
}
