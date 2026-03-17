'use client';

import { AlertTriangle, Info } from 'lucide-react';

interface FailedSource {
  name: string;
  missing: string[];
}

export default function DataQualityBanner({ failedSources }: { failedSources: FailedSource[] }) {
  if (!failedSources.length) return null;

  return (
    <div className="flex items-start gap-4 p-6 rounded-[32px] border border-yellow-500/20
                    bg-yellow-500/5 backdrop-blur-xl mb-8 relative overflow-hidden group animate-slide-up">
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 flex items-center justify-center shrink-0 border border-yellow-500/20">
        <AlertTriangle className="text-yellow-500 w-5 h-5" />
      </div>
      
      <div className="flex-1">
        <p className="text-yellow-400 font-black uppercase tracking-widest text-[10px] mb-1">
          Degraded Data Stream
        </p>
        <p className="text-white/80 font-bold text-sm mb-3">
          Some data sources are temporarily offline.
        </p>
        
        <div className="space-y-2">
          {failedSources.map(src => (
            <div key={src.name} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-yellow-500/40" />
              <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider">
                <span className="text-yellow-500/60 font-black">{src.name}</span>
                <span className="mx-2 opacity-20">|</span>
                Missing: {src.missing.join(', ')}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-white/20">
          <Info className="w-3 h-3" />
          <p className="text-[9px] font-bold uppercase tracking-widest">Protocol: Automatic background re-sync enabled</p>
        </div>
      </div>
    </div>
  );
}
