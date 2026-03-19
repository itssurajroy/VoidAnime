'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase as _supabase } from '@/lib/supabase';
import type { Room, RoomParticipant, RoomChatMessage, PlaybackState, RoomState } from '@/types/room';

const supabase = _supabase!;

const SYNC_INTERVAL_MS = 2000;

export function useWatchRoom() {
  const { user } = useSupabaseAuth();
  
  const [roomState, setRoomState] = useState<RoomState>({
    room: null,
    participants: [],
    messages: [],
    status: 'idle',
    error: null,
    isHost: false,
  });

  const roomIdRef = useRef<string | null>(null);
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRoom = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    
    roomIdRef.current = null;
    setRoomState({
      room: null,
      participants: [],
      messages: [],
      status: 'idle',
      error: null,
      isHost: false,
    });
  }, []);

  const fetchRoomData = useCallback(async (roomId: string) => {
    const [roomRes, participantsRes, messagesRes] = await Promise.all([
      supabase.from('rooms').select('*').eq('id', roomId).single(),
      supabase.from('room_participants').select('*').eq('room_id', roomId),
      supabase.from('room_chat').select('*').eq('room_id', roomId).order('timestamp', { ascending: true }).limit(100)
    ]);

    if (roomRes.data) {
      const roomData = roomRes.data;
      setRoomState(prev => ({
        ...prev,
        room: {
          id: roomData.id,
          animeId: roomData.anime_id,
          episodeId: roomData.episode_id,
          animeTitle: roomData.anime_title,
          animePoster: roomData.anime_poster,
          episodeNumber: roomData.episode_number,
          hostId: roomData.host_id,
          hostName: roomData.host_name,
          isPlaying: roomData.is_playing,
          currentTime: roomData.current_time,
          participantCount: roomData.participant_count,
        } as any, // Cast to Room type
        isHost: roomData.host_id === user?.id,
        participants: (participantsRes.data || []).map(p => ({
          id: p.user_id,
          displayName: p.display_name,
          avatarUrl: p.avatar_url,
          isHost: p.is_host,
          isReady: p.is_ready,
          joinedAt: p.joined_at,
        })),
        messages: (messagesRes.data || []).map(m => ({
          id: m.id,
          userId: m.user_id,
          displayName: m.display_name,
          avatarUrl: m.avatar_url,
          message: m.message,
          timestamp: m.timestamp,
        })),
      }));
    }
  }, [user]);

  const createRoom = useCallback(async (
    animeId: string,
    episodeId: string,
    animeTitle: string,
    episodeNumber: number,
    serverId?: string,
    category?: 'sub' | 'dub',
    animePoster?: string
  ): Promise<string> => {
    if (!user) {
      throw new Error('User must be logged in to create a party');
    }

    const { data: room, error: roomError } = await supabase.from('rooms').insert({
      anime_id: animeId,
      episode_id: episodeId,
      anime_title: animeTitle,
      anime_poster: animePoster,
      episode_number: episodeNumber,
      host_id: user.id,
      host_name: user.user_metadata?.username || 'Anonymous',
      is_playing: false,
      current_time: 0,
      participant_count: 1,
      server_id: serverId,
      category: category,
    }).select().single();

    if (roomError) throw roomError;

    await supabase.from('room_participants').insert({
      room_id: room.id,
      user_id: user.id,
      display_name: user.user_metadata?.username || 'Anonymous',
      avatar_url: user.user_metadata?.avatar_url,
      is_host: true,
      is_ready: false,
    });

    roomIdRef.current = room.id;
    setRoomState(prev => ({
      ...prev,
      status: 'connected',
      isHost: true,
    }));

    return room.id;
  }, [user]);

  const joinRoom = useCallback(async (roomId: string) => {
    if (!user) {
      throw new Error('User must be logged in to join a party');
    }

    setRoomState(prev => ({ ...prev, status: 'connecting', error: null }));

    try {
      const { data: room, error: roomError } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      if (roomError || !room) throw new Error('Party not found');

      const { data: participant } = await supabase.from('room_participants')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', user.id)
        .single();
      
      if (participant) {
        await supabase.from('room_participants').update({ joined_at: new Date().toISOString() })
          .eq('room_id', roomId)
          .eq('user_id', user.id);
      } else {
        await supabase.from('room_participants').insert({
          room_id: roomId,
          user_id: user.id,
          display_name: user.user_metadata?.username || 'Anonymous',
          avatar_url: user.user_metadata?.avatar_url,
          is_host: false,
          is_ready: true,
        });
        await supabase.from('rooms').update({ participant_count: (room.participant_count || 0) + 1 }).eq('id', roomId);
      }

      roomIdRef.current = roomId;
      await fetchRoomData(roomId);

      const channel = supabase
        .channel(`room:${roomId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` }, () => fetchRoomData(roomId))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'room_participants', filter: `room_id=eq.${roomId}` }, () => fetchRoomData(roomId))
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_chat', filter: `room_id=eq.${roomId}` }, () => fetchRoomData(roomId))
        .subscribe();

      setRoomState(prev => ({
        ...prev,
        status: 'connected',
        isHost: room.host_id === user.id,
      }));

      return roomId;
    } catch (error) {
      setRoomState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Failed to join party' 
      }));
      throw error;
    }
  }, [user, fetchRoomData]);

  const leaveRoom = useCallback(async () => {
    if (!user || !roomIdRef.current) return;

    const roomId = roomIdRef.current;
    
    try {
      await supabase.from('room_participants').delete().eq('room_id', roomId).eq('user_id', user.id);
      
      const { data: room } = await supabase.from('rooms').select('*').eq('id', roomId).single();
      
      if (room) {
        if ((room.participant_count || 0) <= 1) {
          await supabase.from('rooms').delete().eq('id', roomId);
        } else {
          await supabase.from('rooms').update({ 
            participant_count: room.participant_count - 1,
            updated_at: new Date().toISOString()
          }).eq('id', roomId);

          if (room.host_id === user.id) {
            const { data: nextParticipants } = await supabase.from('room_participants').select('*').eq('room_id', roomId).limit(1);
            if (nextParticipants && nextParticipants.length > 0) {
              await supabase.from('rooms').update({ 
                host_id: nextParticipants[0].user_id,
                host_name: nextParticipants[0].display_name
              }).eq('id', roomId);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    } finally {
      clearRoom();
    }
  }, [user, clearRoom]);

  const updatePlaybackState = useCallback(async (state: Partial<PlaybackState>) => {
    if (!user || !roomIdRef.current || !roomState.isHost) return;

    try {
      await supabase.from('rooms').update({
        is_playing: state.isPlaying,
        current_time: state.currentTime,
        updated_at: new Date().toISOString(),
      }).eq('id', roomIdRef.current);
    } catch (error) {
      console.error('Error updating playback state:', error);
    }
  }, [user, roomState.isHost]);

  const syncPlaybackState = useCallback(async () => {
    if (!user || !roomIdRef.current || roomState.isHost) return;
    if (!roomState.room) return;

    const { data: room } = await supabase.from('rooms').select('current_time, is_playing').eq('id', roomIdRef.current).single();
    
    if (room) {
      setRoomState(prev => ({
        ...prev,
        room: { ...prev.room!, currentTime: room.current_time, isPlaying: room.is_playing } as any,
      }));
    }
  }, [user, roomState.isHost, roomState.room]);

  const sendMessage = useCallback(async (message: string) => {
    if (!user || !roomIdRef.current || !message.trim()) return;

    await supabase.from('room_chat').insert({
      room_id: roomIdRef.current,
      user_id: user.id,
      display_name: user.user_metadata?.username || 'Anonymous',
      avatar_url: user.user_metadata?.avatar_url,
      message: message.trim(),
    });
  }, [user]);

  const kickParticipant = useCallback(async (participantId: string) => {
    if (!user || !roomIdRef.current || !roomState.isHost) return;
    
    try {
      await supabase.from('room_participants').delete().eq('room_id', roomIdRef.current).eq('user_id', participantId);
      const { data: room } = await supabase.from('rooms').select('participant_count').eq('id', roomIdRef.current).single();
      if (room) {
        await supabase.from('rooms').update({ participant_count: room.participant_count - 1 }).eq('id', roomIdRef.current);
      }
    } catch (error) {
      console.error('Error kicking participant:', error);
    }
  }, [user, roomState.isHost]);

  const togglePlayPause = useCallback(async () => {
    if (!user || !roomIdRef.current || !roomState.isHost || !roomState.room) return;
    
    const newIsPlaying = !roomState.room.isPlaying;
    try {
      await supabase.from('rooms').update({
        is_playing: newIsPlaying,
        updated_at: new Date().toISOString(),
      }).eq('id', roomIdRef.current);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }, [user, roomState.isHost, roomState.room]);

  useEffect(() => {
    if (roomState.status === 'connected' && !roomState.isHost && roomIdRef.current) {
      syncIntervalRef.current = setInterval(syncPlaybackState, SYNC_INTERVAL_MS);
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [roomState.status, roomState.isHost, syncPlaybackState]);

  useEffect(() => {
    return () => {
      clearRoom();
    };
  }, [clearRoom]);

  return {
    ...roomState,
    createRoom,
    joinRoom,
    leaveRoom,
    updatePlaybackState,
    sendMessage,
    kickParticipant,
    togglePlayPause,
  };
}

export function useCurrentRoomId(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('room');
}
