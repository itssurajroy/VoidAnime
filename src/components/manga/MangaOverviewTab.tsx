'use client';

import { Info, Sparkles, BookOpen, Calendar, ShieldAlert, Trophy, Share2, Award } from 'lucide-react';
import { WhereToConsume } from '@/components/anime/detail/WhereToConsume';

interface MangaOverviewTabProps {
  media: any;
  actualChapters?: string;
  actualVolumes?: string;
}

export function MangaOverviewTab({ media, actualChapters, actualVolumes }: MangaOverviewTabProps) {
  const demographic = media.tags?.find((t: any) => 
    ['shounen', 'seinen', 'shoujo', 'josei'].includes(t.name.toLowerCase())
  )?.name;

  const legalSources = media.externalLinks
    ?.filter((link: any) => link.type === 'STREAMING' || link.site.includes('Viz') || link.site.includes('Manga'))
    .map((link: any) => ({ site: link.site, url: link.url })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8 space-y-12">
        <section className="relative overflow-hidden bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 md:p-10 rounded-3xl shadow-2xl group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-anime-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-anime-primary/10 transition-colors duration-700" />
          <h2 className="relative text-2xl font-heading font-black text-white mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-anime-primary" /> Storyline
          </h2>
          <div 
            className="relative text-zinc-300 leading-loose text-lg prose prose-invert max-w-none prose-p:mb-4"
            dangerouslySetInnerHTML={{ __html: media.description || 'No description available.' }} 
          />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6 px-2 text-anime-secondary">
            <BookOpen className="w-6 h-6 fill-current" />
            <h2 className="text-2xl font-heading font-black text-white">Where to Read</h2>
          </div>
          <WhereToConsume 
            title={media.title.english || media.title.romaji} 
            category="manga"
            legalSources={legalSources}
          />
        </section>
      </div>

      <div className="lg:col-span-4 space-y-8">
        {media.rankings?.length > 0 && (
          <div className="p-8 rounded-3xl bg-gradient-to-br from-anime-primary/10 to-transparent border border-anime-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Trophy className="w-24 h-24 text-anime-primary" />
            </div>
            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-4 h-4 text-anime-primary" /> Global Rankings
            </h3>
            <div className="space-y-4 relative z-10">
              {media.rankings.slice(0, 4).map((rank: any, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-xl font-black text-white w-12">#{rank.rank}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white/80 capitalize">{rank.context} {rank.year ? rank.year : ''}</p>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">{rank.type === 'RATED' ? 'Highest Rated' : 'Most Popular'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[#1A1A1A]/40 backdrop-blur-3xl border border-[#2A2A2A] p-8 rounded-3xl shadow-2xl">
          <h3 className="text-xl font-heading font-black text-white mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-anime-accent" /> Series Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4">
              <BookOpen className="w-5 h-5 text-white/20" />
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 block">Format</span>
                <span className="text-sm text-white/90 font-medium">{media.format || 'MANGA'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4">
              <BookOpen className="w-5 h-5 text-white/20" />
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 block">Chapters</span>
                <span className="text-sm text-white/90 font-medium">{actualChapters || '?'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4">
              <BookOpen className="w-5 h-5 text-white/20" />
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 block">Volumes</span>
                <span className="text-sm text-white/90 font-medium">{actualVolumes || '?'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4">
              <Calendar className="w-5 h-5 text-white/20" />
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 block">Start Date</span>
                <span className="text-sm text-white/90 font-medium capitalize">
                  {media.startDate?.year || '?'} {media.startDate?.month ? `/ ${media.startDate.month}` : ''}
                </span>
              </div>
            </div>
            {demographic && (
              <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4">
                <Award className="w-5 h-5 text-white/20" />
                <div>
                  <span className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 block">Demographic</span>
                  <span className="text-sm text-white/90 font-medium capitalize">{demographic}</span>
                </div>
              </div>
            )}
          </div>
          {media.tags?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#2A2A2A]">
              <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-500 mb-4">Themes & Tags</h4>
              <div className="flex flex-wrap gap-2">
                {media.tags?.slice(0, 10).map((tag: any) => (
                  <span key={tag.id} className="text-[10px] px-2.5 py-1.5 bg-[#212121] border border-[#2A2A2A] rounded-lg text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-default flex items-center gap-1.5">
                    {tag.isMediaSpoiler && <ShieldAlert className="w-3 h-3 text-red-400" />}
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A] backdrop-blur-sm shadow-2xl">
          <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <Share2 className="w-4 h-4 text-blue-400" /> Social Buzz
          </h3>
          <div className="space-y-4">
            {media.hashtag && (
              <a href={`https://twitter.com/search?q=${encodeURIComponent(media.hashtag)}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 transition-colors group">
                <span className="text-sm font-bold text-[#1DA1F2]">{media.hashtag}</span>
                <span className="text-[10px] font-black uppercase text-[#1DA1F2]/70 group-hover:text-[#1DA1F2]">Live Feed →</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
