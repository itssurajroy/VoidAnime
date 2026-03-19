'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    Users, Send, Crown, LogOut, Copy, Check, Play, Pause,
    MessageCircle, ChevronLeft, Loader2, X, UserMinus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useWatchRoom } from '@/hooks/useWatchRoom';
import { getEpisodeSources, getEpisodeServers } from '@/services/anime';
import type { PublicRoom } from '@/actions/rooms';

interface RoomClientProps {
    roomId: string;
    initialRoom: PublicRoom;
}

export function RoomClient({ roomId, initialRoom }: RoomClientProps) {
    const router = useRouter();
    const { user } = useSupabaseAuth();
    const {
        room, participants, messages, status, error, isHost,
        joinRoom, leaveRoom, sendMessage, kickParticipant, togglePlayPause, updatePlaybackState,
    } = useWatchRoom();

    const [chatInput, setChatInput] = useState('');
    const [copied, setCopied] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [joining, setJoining] = useState(false);
    const [sourceData, setSourceData] = useState<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<HTMLVideoElement>(null);
    const lastSyncRef = useRef(0);

    // Join room on mount
    useEffect(() => {
        if (!user || status !== 'idle') return;
        setJoining(true);
        joinRoom(roomId).catch(console.error).finally(() => setJoining(false));
    }, [user, roomId, joinRoom, status]);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fetch video source
    useEffect(() => {
        if (!room) return;
        const ep = room.episodeId || initialRoom.episodeId;
        const cat = (room as any).category || initialRoom.category || 'sub';

        async function fetchSource() {
            try {
                const serversRes = await getEpisodeServers(ep);
                const servers = serversRes.data;
                const serverList = cat === 'dub' ? servers?.dub : servers?.sub;
                const serverId = serverList?.[0]?.serverName || 'hd-1';

                const sourcesRes = await getEpisodeSources(ep, 'kaido', cat, serverId);
                if (sourcesRes.data?.sources?.length) {
                    setSourceData(sourcesRes.data);
                }
            } catch (err) {
                console.error('Failed to fetch sources:', err);
            }
        }
        fetchSource();
    }, [room, initialRoom]);

    // Sync playback from host (non-host only)
    useEffect(() => {
        if (!room || isHost || !playerRef.current) return;

        const video = playerRef.current;
        const now = Date.now();

        // Only sync if it's been more than 1.5s since last sync
        if (now - lastSyncRef.current < 1500) return;
        lastSyncRef.current = now;

        const timeDiff = Math.abs(video.currentTime - room.currentTime);
        if (timeDiff > 2) {
            video.currentTime = room.currentTime;
        }

        if (room.isPlaying && video.paused) {
            video.play().catch(() => { });
        } else if (!room.isPlaying && !video.paused) {
            video.pause();
        }
    }, [room, isHost]);

    // Host broadcasts playback state
    const handleTimeUpdate = useCallback(() => {
        if (!isHost || !playerRef.current) return;
        const now = Date.now();
        if (now - lastSyncRef.current < 2000) return;
        lastSyncRef.current = now;

        updatePlaybackState({
            currentTime: playerRef.current.currentTime,
            isPlaying: !playerRef.current.paused,
        });
    }, [isHost, updatePlaybackState]);

    const handlePlayPause = useCallback(() => {
        if (!isHost || !playerRef.current) return;
        updatePlaybackState({
            currentTime: playerRef.current.currentTime,
            isPlaying: !playerRef.current.paused,
        });
    }, [isHost, updatePlaybackState]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        await sendMessage(chatInput);
        setChatInput('');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLeave = async () => {
        await leaveRoom();
        router.push('/watch-together');
    };

    const displayRoom = room || initialRoom;

    // Not logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-white">
                <div className="text-center space-y-6 max-w-md px-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Login Required</h2>
                    <p className="text-white/40 text-sm">You need to be logged in to join a watch party.</p>
                    <Link href="/home">
                        <Button className="h-12 px-8 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.15em] text-xs">
                            Go to Home
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Connecting state
    if (status === 'connecting' || joining) {
        return (
            <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-white">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                    <p className="text-white/50 text-sm font-bold uppercase tracking-widest">Joining Party...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (status === 'error') {
        return (
            <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-white">
                <div className="text-center space-y-6 max-w-md px-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <X className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight">Party Error</h2>
                    <p className="text-white/40 text-sm">{error || 'Failed to join party'}</p>
                    <Link href="/watch-together">
                        <Button className="h-12 px-8 rounded-2xl bg-white/10 text-white font-black uppercase tracking-[0.15em] text-xs hover:bg-white/20">
                            Browse Parties
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const videoSrc = sourceData?.sources?.[0]?.url;
    const posterUrl = (displayRoom as any).animePoster;

    return (
        <div className="min-h-screen bg-[#0B0C10] text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {posterUrl && (
                    <Image
                        src={posterUrl}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover opacity-[0.06] blur-[100px] scale-125"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10]/50 via-[#0B0C10]/80 to-[#0B0C10]" />
            </div>

            <div className="relative z-10 pt-20">
                {/* Room Header */}
                <div className="container mx-auto px-4 md:px-8 max-w-[1600px] pb-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/watch-together">
                                <Button variant="ghost" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 p-0">
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-lg font-black text-white uppercase tracking-tight line-clamp-1">
                                    {displayRoom.animeTitle}
                                </h1>
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                                    Episode {displayRoom.episodeNumber} · {isHost ? 'You are the host' : `Hosted by ${displayRoom.hostName}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleCopyLink}
                                className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 gap-2 text-[10px] font-black uppercase tracking-widest"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied' : 'Invite'}
                            </Button>
                            <Button
                                onClick={() => setShowChat(!showChat)}
                                className={cn(
                                    "h-10 w-10 rounded-xl border p-0 transition-all",
                                    showChat ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white/60 hover:text-white"
                                )}
                            >
                                <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={handleLeave}
                                className="h-10 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 gap-2 text-[10px] font-black uppercase tracking-widest"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Leave
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 md:px-8 max-w-[1600px]">
                    <div className={cn(
                        "grid gap-6 transition-all duration-500",
                        showChat ? "grid-cols-1 lg:grid-cols-[1fr_380px]" : "grid-cols-1"
                    )}>
                        {/* Video Player Area */}
                        <div className="space-y-4">
                            <div className="relative aspect-video bg-black rounded-[24px] overflow-hidden border border-white/5 shadow-2xl">
                                {videoSrc ? (
                                    <video
                                        ref={playerRef}
                                        src={videoSrc}
                                        className="w-full h-full"
                                        controls
                                        onTimeUpdate={handleTimeUpdate}
                                        onPlay={handlePlayPause}
                                        onPause={handlePlayPause}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Loading video...</p>
                                    </div>
                                )}

                                {/* Host Playback Controls Overlay */}
                                {isHost && (
                                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                        <div className="px-3 py-1.5 rounded-xl bg-primary/20 backdrop-blur-xl border border-primary/30 text-primary text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                            <Crown className="w-3 h-3" />
                                            Host Control
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Participants Strip */}
                            <div className="bg-card/40 backdrop-blur-xl rounded-2xl p-4 border border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                                            {participants.length} Watching
                                        </span>
                                    </div>
                                    {isHost && (
                                        <Button
                                            onClick={togglePlayPause}
                                            className="h-8 px-3 rounded-lg bg-primary/20 border border-primary/30 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-primary/30 gap-1.5"
                                        >
                                            {room?.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                                            {room?.isPlaying ? 'Pause All' : 'Play All'}
                                        </Button>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {participants.map(p => (
                                        <div
                                            key={p.id}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 group/participant"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-white/10">
                                                {p.avatarUrl ? (
                                                    <Image src={p.avatarUrl} alt="" width={28} height={28} className="object-cover" />
                                                ) : (
                                                    <span className="text-[9px] font-black text-primary uppercase">
                                                        {p.displayName?.charAt(0) || '?'}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] font-bold text-white/70 truncate max-w-[80px]">
                                                {p.displayName}
                                            </span>
                                            {p.isHost && <Crown className="w-3 h-3 text-yellow-400" />}
                                            {isHost && !p.isHost && (
                                                <button
                                                    onClick={() => kickParticipant(p.id)}
                                                    className="opacity-0 group-hover/participant:opacity-100 transition-opacity ml-1"
                                                    title="Kick"
                                                >
                                                    <UserMinus className="w-3 h-3 text-red-400 hover:text-red-300" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Chat Panel */}
                        {showChat && (
                            <div className="bg-card/40 backdrop-blur-xl rounded-[24px] border border-white/5 flex flex-col h-[calc(100vh-180px)] sticky top-24">
                                {/* Chat Header */}
                                <div className="p-5 border-b border-white/5 flex items-center justify-between shrink-0">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-black text-white uppercase tracking-widest">Chat</span>
                                    </div>
                                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                                        {messages.length} messages
                                    </span>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                                    {messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                                            <MessageCircle className="w-8 h-8 text-white/10" />
                                            <p className="text-white/20 text-xs font-bold">No messages yet</p>
                                            <p className="text-white/10 text-[10px]">Be the first to say hi!</p>
                                        </div>
                                    ) : (
                                        messages.map(msg => (
                                            <div key={msg.id} className="flex gap-3 group/msg">
                                                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden border border-white/10">
                                                    {msg.avatarUrl ? (
                                                        <Image src={msg.avatarUrl} alt="" width={28} height={28} className="object-cover" />
                                                    ) : (
                                                        <span className="text-[8px] font-black text-primary uppercase">
                                                            {msg.displayName?.charAt(0) || '?'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-[11px] font-black text-white/60 uppercase tracking-tight truncate">
                                                            {msg.displayName}
                                                        </span>
                                                        <span className="text-[9px] text-white/15 font-bold shrink-0">
                                                            {msg.timestamp 
                                                                ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                                : ''}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-white/80 leading-relaxed break-words">{msg.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Chat Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 shrink-0">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={e => setChatInput(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all"
                                            maxLength={500}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={!chatInput.trim()}
                                            className="h-11 w-11 rounded-xl bg-primary text-black hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed p-0"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
