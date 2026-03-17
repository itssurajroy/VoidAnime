'use client';

import { motion } from "framer-motion";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Trophy, Clock, Tv, Calendar, Globe, Building2, User, Hash, Info, Star, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";


interface AnimeInfoPanelProps {
  anime: any;
  aniListData: any;
}

export function AnimeInfoPanel({ anime, aniListData }: AnimeInfoPanelProps) {
  const { info, moreInfo } = anime;

  const studios = Array.from(new Set([
    ...(aniListData?.studios?.nodes?.filter((s: any) => s.isAnimationStudio).map((s: any) => s.name) || []),
    ...(moreInfo.studios ? moreInfo.studios.split(',').map((s: string) => s.trim()) : [])
  ]));

  const formatKebab = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const renderValue = (label: string, value: string) => {
    if (label === "Studios" || label === "Producers") {
      const items = value.split(',').map(s => s.trim());
      const routePrefix = label === "Studios" ? "/studio" : "/producer";
      
      return (
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {items.map((item, idx) => (
            <Link 
              key={idx} 
              href={`${routePrefix}/${formatKebab(item)}`}
              className="hover:text-primary transition-colors cursor-pointer underline decoration-white/10 hover:decoration-primary/50 underline-offset-4"
            >
              {item}{idx < items.length - 1 ? ',' : ''}
            </Link>
          ))}
        </div>
      );
    }

    if (label === "Official Site") {
      if (!value || value === 'N/A') return 'N/A';
      return (
        <a 
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline underline-offset-4 flex items-center gap-1.5 group/link cursor-pointer"
        >
          Visit Promo Site
          <ChevronRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </a>
      );
    }

    return value;
  };

  const sections = [
    {
      title: "Core Details",
      icon: Info,
      items: [
        { label: "Japanese", value: aniListData?.title?.native || moreInfo.japanese || 'N/A', icon: Globe },
        { label: "Synonyms", value: moreInfo.synonyms || 'N/A', icon: Info },
        { label: "Format", value: aniListData?.format || info.stats?.type || 'TV', icon: Tv },
        { label: "Duration", value: info.stats?.duration || 'N/A', icon: Clock },
        { label: "Status", value: moreInfo.status || 'N/A', icon: Calendar },
        { label: "Aired", value: moreInfo.aired || 'N/A', icon: Calendar },
        { 
          label: "Official Site", 
          value: aniListData?.externalLinks?.find((l: any) => l.site === 'Official Site')?.url || 'N/A', 
          icon: ExternalLink 
        },
      ]
    },
    {
      title: "Production",
      icon: Building2,
      items: [
        { label: "Studios", value: studios.join(', ') || 'Unknown', icon: Building2 },
        { label: "Producers", value: Array.isArray(moreInfo.producers) ? moreInfo.producers.join(', ') : (moreInfo.producers || 'N/A'), icon: User },
      ]
    },
    {
      title: "Scores",
      icon: Trophy,
      items: [
        { label: "MAL Score", value: moreInfo.malscore || 'N/A', icon: Star },
        { label: "Rank", value: moreInfo.rank && moreInfo.rank !== '??' ? `#${moreInfo.rank}` : 'N/A', icon: Hash },
      ]
    }
  ];
  // Filter out items with no meaningful data
  const filteredSections = sections.map(section => ({
    ...section,
    items: section.items.filter(item => !['N/A', '?', '??', '#N/A', 'Unknown'].includes(item.value))
  })).filter(section => section.items.length > 0);

  return (
    <div className="space-y-8">
      {filteredSections.map((section, sIdx) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: sIdx * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4 ml-2">
            <section.icon className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{section.title}</h3>
          </div>

          <GlassPanel intensity="light" className="p-4 md:p-6 space-y-4 overflow-visible rounded-[24px]">
            {section.items.map((item, iIdx) => (
              <div key={item.label} className="group relative flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-500 mt-1">
                    <item.icon className="w-4 h-4" />
                  </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5 group-hover:text-primary transition-colors">{item.label}</p>
                  <div className="text-sm font-bold text-white/90 leading-snug break-words">
                    {renderValue(item.label, item.value)}
                  </div>
                </div>
                {iIdx !== section.items.length - 1 && (
                  <div className="absolute -bottom-2 left-12 right-0 h-px bg-white/5" />
                )}
              </div>
            ))}
          </GlassPanel>
        </motion.div>
      ))}
    </div>
  );
}
