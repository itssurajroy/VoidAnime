'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Clock, Search, Plus, Tv, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PublicRoom } from '@/actions/rooms';

interface LobbyClientProps {
    initialRooms: PublicRoom[];
}

export function LobbyClient({ initialRooms }: LobbyClientProps) {
    const [rooms] = useState<PublicRoom[]>(initialRooms);
    const [search, setSearch] = useState('');

    const filteredRooms = rooms.filter(room =>
        room.animeTitle.toLowerCase().includes(search.toLowerCase()) ||
        room.hostName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0B0C10] text-white pb-32">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse-soft" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 md:px-8 max-w-[1400px] relative z-10 pt-32 space-y-12">
                {/* Header */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]">
                        <Users className="w-3.5 h-3.5" />
                        Watch Party
                    </div>
                    <h1 className="text-5xl md:text-7xl font-[1000] text-white uppercase tracking-tighter leading-[0.9] font-headline">
                        Watch<span className="text-primary"> Parties</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl mx-auto font-medium italic">
                        Join active parties or start watching any anime and create your own watch party.
                    </p>
                </div>

                {/* Search & Create */}
                <div className="flex flex-col sm:flex-row items-center gap-4 max-w-2xl mx-auto">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search by anime or host..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-medium placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all"
                        />
                    </div>
                    <Link href="/home">
                        <Button className="h-14 px-8 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.15em] text-xs hover:bg-primary/90 transition-all gap-2 whitespace-nowrap shadow-[0_10px_30px_rgba(147,51,234,0.3)]">
                            <Plus className="w-4 h-4" />
                            Start Watching
                        </Button>
                    </Link>
                </div>

                {/* Room Grid */}
                {filteredRooms.length === 0 ? (
                    <div className="text-center py-24 space-y-6">
                        <div className="w-24 h-24 mx-auto rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Tv className="w-10 h-10 text-white/10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-white/60 uppercase tracking-tight">No Active Parties</h3>
                            <p className="text-white/30 text-sm max-w-md mx-auto">
                                There are no active watch parties right now. Start watching any anime and click the Watch Party button to create one!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRooms.map(room => (
                            <Link
                                key={room.id}
                                href={`/watch-together/${room.id}`}
                                className="group relative bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 saas-shadow"
                            >
                                {/* Room Poster */}
                                <div className="relative aspect-video overflow-hidden">
                                    {room.animePoster ? (
                                        <Image
                                            src={room.animePoster}
                                            alt={room.animeTitle}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-75"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center">
                                            <Tv className="w-12 h-12 text-white/10" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />

                                    {/* Live Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        {room.isPlaying && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                Live
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white/80 text-[9px] font-black uppercase tracking-widest border border-white/10">
                                            <Users className="w-3 h-3" />
                                            {room.participantCount}
                                        </div>
                                    </div>

                                    {/* Join Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.6)] group-hover:scale-110 transition-transform duration-500">
                                            <UserPlus className="w-7 h-7 text-black" />
                                        </div>
                                    </div>
                                </div>

                                {/* Room Info */}
                                <div className="p-6 space-y-4">
                                    <div className="space-y-2">
                                        <h3 className="text-[15px] font-black text-white uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                            {room.animeTitle}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-white/30 uppercase tracking-widest">
                                            <span>Episode {room.episodeNumber}</span>
                                            <div className="w-1 h-1 rounded-full bg-white/10" />
                                            <span>{room.category?.toUpperCase() || 'SUB'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-[9px] font-black text-primary uppercase">
                                                    {room.hostName.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest truncate max-w-[120px]">
                                                {room.hostName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-white/20">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
