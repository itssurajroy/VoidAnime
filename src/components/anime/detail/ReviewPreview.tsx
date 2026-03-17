'use client';

import { motion } from "framer-motion";
import { MessageSquare, PenLine } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";

export function ReviewPreview() {
  return (
    <section>
      <SectionHeader title="Fan Reviews" icon={MessageSquare} subtitle="User Reviews" />
      <div className="bg-white/[0.02] border border-white/5 border-dashed rounded-[32px] p-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 opacity-20">
          <MessageSquare className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-white/60 text-lg font-black uppercase tracking-tight">No Reviews Yet</p>
          <p className="text-white/20 text-sm font-medium italic">Reviews for this series are coming soon. Be the first to share your thoughts!</p>
        </div>
        
        <Button className="h-12 px-8 rounded-2xl bg-primary text-black hover:bg-white transition-all duration-500 font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-primary/20">
          <PenLine className="w-4 h-4" />
          Write the first review
        </Button>
      </div>
    </section>
  );
}
