'use client';

import { GitFork, Map, FastForward, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { slugify } from '@/lib/utils/slugify';

export function FranchiseTab({ media }: { media: any }) {
  const relations = media.relations?.edges || [];

  if (!relations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
        <GitFork className="w-12 h-12 mb-4 opacity-20" />
        <p className="font-bold tracking-widest uppercase">No franchise relations found.</p>
      </div>
    );
  }

  const prequels = relations.filter((r: any) => r.relationType === 'PREQUEL');
  const sequels = relations.filter((r: any) => r.relationType === 'SEQUEL');
  const sideStories = relations.filter((r: any) => r.relationType === 'SIDE_STORY' || r.relationType === 'SPIN_OFF');
  const adaptations = relations.filter((r: any) => r.relationType === 'ADAPTATION');
  const others = relations.filter((r: any) => !['PREQUEL', 'SEQUEL', 'SIDE_STORY', 'SPIN_OFF', 'ADAPTATION'].includes(r.relationType));

  const RelationCard = ({ item, relationName }: { item: any; relationName: string }) => {
    const node = item.node;
    const slug = `${slugify(node.title.english || node.title.romaji)}-${node.id}`;
    const targetUrl = node.type === 'ANIME' ? `/anime/${slug}` : `/manga/${slug}`;

    return (
      <Link href={targetUrl} className="flex gap-4 p-4 rounded-3xl bg-[#1A1A1A]/30 border border-[#2A2A2A] hover:bg-[#212121] hover:border-[#2A2A2A] transition-all group shadow-xl">
        <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-md">
          <Image src={node.coverImage.large} alt={node.title.romaji} fill className="object-cover group-hover:scale-105 transition-transform" />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-anime-primary bg-anime-primary/10 px-2 py-0.5 rounded-md w-fit mb-2">
            {relationName.replace('_', ' ')}
          </span>
          <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-anime-accent transition-colors">
            {node.title.english || node.title.romaji}
          </h4>
          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-2">
            {node.format} • {node.status.replace('_', ' ')}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
      <div className="lg:col-span-8 space-y-12">
        <div className="flex items-center gap-3 px-2 mb-6">
          <GitFork className="w-6 h-6 text-anime-primary" />
          <h2 className="text-2xl font-heading font-black text-white">Franchise & Timeline</h2>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
          {prequels.length > 0 && (
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0D0D0D] bg-anime-primary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_20px_rgba(157,78,221,0.5)] relative z-10">
                <FastForward className="w-5 h-5 rotate-180" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A] shadow-xl backdrop-blur-sm hover:border-anime-primary/30 transition-all">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Prequels (Watch First)</h3>
                <div className="space-y-3">
                  {prequels.map((r: any) => <RelationCard key={r.node.id} item={r} relationName={r.relationType} />)}
                </div>
              </div>
            </div>
          )}

          <div className="relative flex items-center justify-center">
            <div className="px-6 py-2 rounded-full bg-anime-accent text-black font-black uppercase tracking-widest text-xs relative z-10 shadow-[0_0_20px_rgba(199,125,255,0.6)]">
              You Are Here
            </div>
          </div>

          {sequels.length > 0 && (
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#0D0D0D] bg-anime-secondary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_20px_rgba(90,24,154,0.5)] relative z-10">
                <FastForward className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-4 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A] shadow-xl backdrop-blur-sm hover:border-anime-secondary/30 transition-all">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Sequels (Watch Next)</h3>
                <div className="space-y-3">
                  {sequels.map((r: any) => <RelationCard key={r.node.id} item={r} relationName={r.relationType} />)}
                </div>
              </div>
            </div>
          )}
        </div>

        {(sideStories.length > 0 || others.length > 0) && (
          <div className="pt-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-300 mb-6 px-2">Side Stories & Others</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...sideStories, ...others].map((r: any) => <RelationCard key={r.node.id} item={r} relationName={r.relationType} />)}
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-4 space-y-8">
        {adaptations.length > 0 && (
          <div className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 rounded-[32px] shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-anime-accent" /> Source Material
            </h3>
            <div className="space-y-4">
              {adaptations.map((r: any) => (
                <div key={r.node.id}>
                  <RelationCard item={r} relationName={r.relationType} />
                  <div className="mt-4 p-4 rounded-2xl bg-[#212121] border border-[#2A2A2A] text-xs text-zinc-300 leading-relaxed">
                    <span className="text-anime-accent font-bold">Coverage Info: </span> 
                    Community notes suggest this anime adapts volumes 1-4 of the source material. Read from volume 5 to continue the story.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 rounded-[32px] shadow-2xl sticky top-28">
          <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
            <Map className="w-4 h-4 text-yellow-500" /> Watch Order Guide
          </h3>
          <p className="text-xs text-zinc-300 italic mb-6">
            Confused where to start? Here is the community-voted recommended watch order for the franchise.
          </p>
          <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-white/10">
            {['Prequel Movie', 'Main Series Season 1', 'OVA (Optional)', 'Main Series Season 2'].map((step, i) => (
              <div key={i} className="flex gap-4 relative group cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-[#0D0D0D] border-2 border-anime-primary flex items-center justify-center shrink-0 relative z-10 text-[8px] font-black group-hover:bg-anime-primary group-hover:text-white transition-colors">
                  {i + 1}
                </div>
                <div className="pt-0.5">
                  <p className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
