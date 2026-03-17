'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Mic2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CharacterCarouselProps {
  characters: any[];
}

export function CharacterCarousel({ characters }: CharacterCarouselProps) {
  if (!characters || characters.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Characters & Voice Cast" icon={Users} subtitle="Voice Cast" />
      <div className="relative group/carousel px-4">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {characters.map((char: any, i: number) => (
              <CarouselItem key={i} className="pl-4 basis-[90%] sm:basis-1/2 lg:basis-1/2 xl:basis-1/3 pb-12">
                <motion.a
                  href={`https://anilist.co/character/${char.node.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="block h-full"
                >
                  <GlassPanel intensity="medium" className="h-[200px] group/card hover:border-primary/50 transition-all duration-700 glass-reflection cursor-pointer rounded-2xl border-white/10 overflow-hidden">
                    <div className="flex h-full w-full">
                      {/* Character Side */}
                      <div className="relative w-1/2 h-full">
                        <Image
                          src={char.node.image.large}
                          alt={char.node.name.full}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 15vw"
                          className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="mb-1">
                            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                              {char.role}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tighter line-clamp-2 leading-tight">
                            {char.node.name.full}
                          </h4>
                        </div>
                      </div>

                      {/* VA Side */}
                      <div className="relative w-1/2 h-full border-l border-white/5 bg-white/[0.02] flex flex-col">
                        {char.voiceActors?.[0] ? (
                          <>
                            <div className="relative flex-1">
                              <Image
                                src={char.voiceActors[0].image.large}
                                alt={char.voiceActors[0].name.full}
                                fill
                                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 15vw"
                                className="object-cover opacity-60 group-hover/card:opacity-100 transition-opacity duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent opacity-90" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 text-right">
                              <div className="flex items-center justify-end gap-1.5 text-white/40 mb-1">
                                <Mic2 className="w-2.5 h-2.5" />
                                <span className="text-[8px] font-black uppercase tracking-[0.2em]">Voice Actor</span>
                              </div>
                              <h4 className="text-sm font-black text-white/70 uppercase tracking-tighter line-clamp-2 leading-tight">
                                {char.voiceActors[0].name.full}
                              </h4>
                            </div>
                          </>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                            <Mic2 className="w-8 h-8 mb-2" />
                            <span className="text-[8px] font-black uppercase tracking-widest">TBA</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </GlassPanel>
                </motion.a>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute -top-20 right-4 hidden md:flex gap-3">
            <CarouselPrevious className="static translate-y-0 w-12 h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all" />
            <CarouselNext className="static translate-y-0 w-12 h-12 rounded-2xl bg-white/5 border-white/10 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
