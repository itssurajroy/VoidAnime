'use client';

import { motion } from "framer-motion";
import Link from "next/link";

interface GenreChipsProps {
  genres: string[];
}

export function GenreChips({ genres }: GenreChipsProps) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mt-8">
      {genres.map((g, i) => (
        <motion.div
          key={g}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Link
            href={`/genre/${g.toLowerCase().replace(/\s+/g, '-')}`}
            className="px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-2xl text-[11px] font-black text-white/60 hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all cursor-pointer uppercase tracking-widest block"
          >
            {g}
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
