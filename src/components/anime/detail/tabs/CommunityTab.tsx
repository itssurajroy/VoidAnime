'use client';

import { Map, Users, Settings2, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export function CommunityTab({ media }: { media: any }) {
  const watchGuides = [
    { title: 'Essential Only', desc: '180 eps skipping all filler', votes: 4500, type: '⚡' },
    { title: 'Completionist', desc: 'All 247 eps + 12 movies + 8 OVAs', votes: 1200, type: '📺' },
    { title: 'Must-Watch', desc: 'Top 50 community-voted episodes only', votes: 890, type: '🚀' },
  ];

  const hotTakes = [
    { text: 'The ending ruined the show', agree: 43, disagree: 57 },
    { text: 'Season 2 was better than Season 1', agree: 67, disagree: 33 },
    { text: 'Sub is unwatchable — dub only', agree: 12, disagree: 88 },
  ];

  const checkList = [
    { text: 'No prior knowledge needed', type: 'success' },
    { text: 'Contains graphic violence (EP 8, 14, 23)', type: 'warning' },
    { text: 'Slow first 3 episodes — gets much better', type: 'info' },
    { text: 'Total commitment: ~9.5 hours to complete', type: 'info' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
      <div className="lg:col-span-8 space-y-12">
        <section>
          <h2 className="text-2xl font-heading font-black text-white px-2 mb-6 flex items-center gap-3">
            <Map className="w-6 h-6 text-anime-primary" /> Community Watch Guides
          </h2>
          <div className="space-y-4">
            {watchGuides.map((guide, i) => (
              <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-sm group hover:bg-[#212121] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#212121] flex items-center justify-center text-xl shadow-inner">
                    {guide.type}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{guide.title}</h4>
                    <p className="text-xs text-white/50 mt-1">{guide.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-anime-primary">^{guide.votes}</span>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Votes</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-heading font-black text-white px-2 mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-anime-secondary" /> Hot Takes
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {hotTakes.map((take, i) => (
              <div key={i} className="p-6 rounded-3xl bg-[#1A1A1A]/30 border border-[#2A2A2A] backdrop-blur-sm">
                <p className="text-white/80 font-medium italic mb-4">"{take.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 flex h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${take.agree}%` }} />
                    <div className="bg-blue-500 h-full" style={{ width: `${take.disagree}%` }} />
                  </div>
                  <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 w-32 justify-end">
                    <span className="text-red-400">{take.agree}% Agree</span>
                    <span className="text-blue-400">{take.disagree}% Disagree</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="lg:col-span-4 space-y-8">
        <div className="p-8 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-3xl shadow-2xl sticky top-40">
          <h3 className="text-xl font-heading font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-500" /> Before You Watch
          </h3>
          <div className="space-y-4">
            {checkList.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  item.type === 'success' ? 'bg-green-500' : 
                  item.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <p className="text-sm text-white/80 leading-snug">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-[32px] bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-3xl shadow-2xl">
          <h3 className="text-xs font-black text-zinc-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> Personal Alerts
          </h3>
          <div className="space-y-4">
            {[
              { label: 'New episode airs', active: true },
              { label: 'BD/DVD release date', active: true },
              { label: 'Season 2 announced', active: true },
              { label: 'Merchandise announced', active: false },
              { label: 'Game adaptation news', active: false },
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-[#2A2A2A] last:border-0 last:pb-0">
                <span className="text-sm text-white/70">{setting.label}</span>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${setting.active ? 'bg-anime-primary' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${setting.active ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
