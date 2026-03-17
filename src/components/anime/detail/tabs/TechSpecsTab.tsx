'use client';

import { Video, Award, ShieldCheck, Cpu } from 'lucide-react';

export function TechSpecsTab({ media }: { media: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
      <div className="lg:col-span-8 space-y-12">
        <div className="flex items-center gap-3 px-2 mb-6 text-anime-primary">
          <Cpu className="w-6 h-6 fill-current" />
          <h2 className="text-2xl font-heading font-black text-white">Technical Specifications</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] shadow-xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Video className="w-4 h-4 text-blue-400" /> Broadcast Quality
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-2">
                <span className="text-xs text-zinc-300 font-bold">Native Resolution</span>
                <span className="text-sm font-black text-white">1080p (FHD)</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-2">
                <span className="text-xs text-zinc-300 font-bold">Aspect Ratio</span>
                <span className="text-sm font-black text-white">16:9</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-2">
                <span className="text-xs text-zinc-300 font-bold">Audio Format</span>
                <span className="text-sm font-black text-white">Stereo / 2.0 Ch</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs text-zinc-300 font-bold">HDR Support</span>
                <span className="text-[10px] font-black uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">Unsupported</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] shadow-xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" /> Blu-Ray Release
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-2">
                <span className="text-xs text-zinc-300 font-bold">Animation Fixes</span>
                <span className="text-[10px] font-black uppercase bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">Extensive</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-2">
                <span className="text-xs text-zinc-300 font-bold">Uncensored</span>
                <span className="text-sm font-black text-white">Yes</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-2">
                <span className="text-xs text-zinc-300 font-bold">Volumes</span>
                <span className="text-sm font-black text-white">8 Volumes</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs text-zinc-300 font-bold">Included Extras</span>
                <span className="text-sm font-black text-white">OST CD, Artbook</span>
              </div>
            </div>
          </div>
        </div>

        <section>
           <h3 className="text-lg font-heading font-black text-white mb-6 px-2">Sub-Studio Outsourcing</h3>
           <div className="p-6 rounded-[32px] bg-[#1A1A1A]/30 border border-[#2A2A2A]">
             <p className="text-sm text-zinc-300 leading-relaxed mb-4 font-medium">
               While {media.studios?.edges?.[0]?.node?.name || 'the main studio'} is credited as the primary animation studio, several episodes were outsourced to maintain the production schedule.
             </p>
             <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-[#212121] rounded-lg text-xs font-bold text-white/80 border border-[#2A2A2A]">Studio LAN (EP 4, 9)</span>
                <span className="px-3 py-1.5 bg-[#212121] rounded-lg text-xs font-bold text-white/80 border border-[#2A2A2A]">CloverWorks (3D CG Assist)</span>
                <span className="px-3 py-1.5 bg-[#212121] rounded-lg text-xs font-bold text-white/80 border border-[#2A2A2A]">Ufotable (Photography Assist)</span>
             </div>
           </div>
        </section>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="p-8 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] shadow-2xl sticky top-28">
           <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
             <ShieldCheck className="w-5 h-5 text-green-400" /> Content Safety
           </h3>
           <div className="space-y-4">
             <div className="p-4 bg-[#212121] rounded-2xl border border-[#2A2A2A]">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Age Rating</p>
                <p className="text-lg font-black text-white">{media.isAdult ? 'R-18+ (Explicit)' : 'R-17+ (Violence & Profanity)'}</p>
             </div>
             <div className="p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                <p className="text-[10px] font-black text-red-400/50 uppercase tracking-widest mb-2">Trigger Warnings</p>
                <div className="flex flex-wrap gap-2">
                  {media.tags?.filter((t:any) => t.isMediaSpoiler || t.category === 'Cast-Trauma').slice(0, 5).map((t:any) => (
                    <span key={t.id} className="text-[10px] px-2 py-1 bg-red-500/20 text-red-400 rounded border border-red-500/30 font-bold uppercase">{t.name}</span>
                  ))}
                  {(!media.tags || media.tags.length === 0) && <span className="text-xs text-red-400">Gore, Psychological Trauma</span>}
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
