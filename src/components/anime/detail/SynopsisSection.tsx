'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";

interface SynopsisSectionProps {
  description: string;
  tags?: any[];
  animeName?: string;
  studios?: string[];
}

export function SynopsisSection({ description, tags, animeName, studios }: SynopsisSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setIsExpandable(el.scrollHeight > 125);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [description]);

  return (
    <section className="relative">
      <SectionHeader title="Synopsis" icon={BookOpen} subtitle="Summary" />

      {/* The tags are moved inside the GlassPanel below */}

      <GlassPanel intensity="heavy" className="p-6 md:p-8 group/synopsis relative overflow-hidden">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.slice(0, 8).map((tag: any) => (
              <div key={tag.id} className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                {tag.name}
              </div>
            ))}
          </div>
        )}
        <div
          ref={contentRef}
          className={cn(
            "relative transition-all duration-700 ease-[0.16, 1, 0.3, 1] overflow-hidden",
            !expanded && isExpandable ? "max-h-[160px]" : "max-h-[2000px]"
          )}
        >
          <div
            dangerouslySetInnerHTML={{ __html: description || "The narrative remains uncharted. Experience the journey firsthand." }}
            className="prose prose-invert prose-p:text-white/80 prose-p:leading-relaxed prose-p:text-base md:prose-p:text-lg max-w-none font-medium selection:bg-primary/30 tracking-wide"
          />
          <AnimatePresence>
            {!expanded && isExpandable && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/90 to-transparent pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>

        {isExpandable && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="group flex items-center gap-3 px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-black hover:border-primary transition-all duration-500"
            >
              {expanded ? (
                <>Read Less <ChevronUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" /></>
              ) : (
                <>Read Full Synopsis <ChevronDown className="w-3 h-3 group-hover:translate-y-1 transition-transform" /></>
              )}
            </button>
          </div>
        )}

        {/* Promotion Paragraph */}
        <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
          <p className="text-white/40 text-[13px] leading-relaxed italic font-medium">
            <span className="text-primary font-black uppercase tracking-widest text-[10px] mr-2">Pro Tip:</span>
            VoidAnime is the best site to watch <span className="text-white font-bold">{animeName} SUB</span> online, or you can even watch <span className="text-white font-bold">{animeName} DUB</span> in HD quality. 
            {studios && studios.length > 0 && (
              <> You can also find <span className="text-primary font-bold">{studios[0]}</span> anime on VoidAnime website.</>
            )}
          </p>
        </div>
      </GlassPanel>
    </section>
  );
}
