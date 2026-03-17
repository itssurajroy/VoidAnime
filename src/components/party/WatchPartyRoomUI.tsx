'use client';

import { useEffect, useState, useRef } from 'react';
import { subscribeToRoom, updateRoomSync, WatchPartyRoom } from '@/lib/firebase/watchParty';
import { Play, Pause, Users, MessageSquare, Send, Share2 } from 'lucide-react';
import Image from 'next/image';

export function WatchPartyRoomUI({ roomId, currentUser }: { roomId: string, currentUser: any }) {
  const [room, setRoom] = useState<WatchPartyRoom | null>(null);
  const [message, setMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHost = room?.hostUid === currentUser?.uid;

  useEffect(() => {
    const unsubscribe = subscribeToRoom(roomId, (data) => {
      setRoom(data);
      
      // Sync video timestamp if not the one who updated it
      if (videoRef.current) {
        const diff = Math.abs(videoRef.current.currentTime - data.currentTime);
        if (diff > 2) { // 2 second threshold to prevent infinite loop
          videoRef.current.currentTime = data.currentTime;
        }
        if (data.isPlaying && videoRef.current.paused) {
          videoRef.current.play().catch(e => console.log("Autoplay blocked"));
        } else if (!data.isPlaying && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      }
    });
    return () => unsubscribe();
  }, [roomId]);

  const handlePlayPause = () => {
    if (!isHost) return;
    updateRoomSync(roomId, { 
      isPlaying: !room?.isPlaying,
      currentTime: videoRef.current?.currentTime || 0
    });
  };

  const handleTimeUpdate = () => {
    if (isHost && videoRef.current) {
      // Periodic sync every 5 seconds
      if (Math.floor(videoRef.current.currentTime) % 5 === 0) {
        updateRoomSync(roomId, { currentTime: videoRef.current.currentTime });
      }
    }
  };

  if (!room) return <div className="h-screen flex items-center justify-center text-white">Loading Party...</div>;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden pt-16">
      {/* Video Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        <video 
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          className="w-full max-h-full aspect-video shadow-2xl"
          src={`https://example.com/stream/${room.mediaId}/${room.episode}.mp4`} // Placeholder
          controls={isHost}
        />
        
        {/* Sync Overlay for non-hosts */}
        {!isHost && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-[#2A2A2A] text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Synced with Host
          </div>
        )}
      </div>

      {/* Sidebar: Info & Chat */}
      <div className="w-full lg:w-96 bg-[#1A1A1A] border-l border-[#2A2A2A] flex flex-col">
        {/* Media Info */}
        <div className="p-6 border-b border-[#2A2A2A] bg-[#0D0D0D]/50">
          <div className="flex gap-4 items-center mb-4">
            <div className="relative w-12 h-16 rounded-md overflow-hidden shrink-0 border border-[#2A2A2A]">
              <Image src={room.mediaCover} alt={room.mediaTitle} fill className="object-cover" />
            </div>
            <div>
              <h3 className="text-white font-bold line-clamp-1">{room.mediaTitle}</h3>
              <p className="text-anime-primary text-xs font-black uppercase tracking-widest">Episode {room.episode}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{room.participants.length} Watching</span>
            </div>
            <button className="hover:text-white transition-colors flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Invite
            </button>
          </div>
        </div>

        {/* Chat Area (Placeholder) */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            <div className="text-center py-10 opacity-20">
              <MessageSquare className="w-12 h-12 mx-auto mb-2" />
              <p className="text-xs font-bold uppercase tracking-widest">Beginning of Chat</p>
            </div>
            {/* Realtime chat would go here */}
          </div>

          <div className="mt-4 relative">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send a reaction..."
              className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl py-3 px-4 text-sm text-white focus:border-anime-primary outline-none transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-anime-primary hover:text-white transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
