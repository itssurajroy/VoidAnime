'use server';

import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';

const supabaseAdmin = _supabaseAdmin!;

export interface PublicRoom {
  id: string;
  animeId: string;
  animeTitle: string;
  animePoster?: string;
  episodeId: string;
  episodeNumber: number;
  hostId: string;
  hostName: string;
  participantCount: number;
  isPlaying: boolean;
  createdAt: Date;
  category?: 'sub' | 'dub';
}

export async function createRoom(data: {
  animeId: string;
  episodeId: string;
  animeTitle: string;
  animePoster?: string;
  episodeNumber: number;
  hostId: string;
  hostName: string;
  category?: 'sub' | 'dub';
}) {
  try {
    const { data: roomData, error } = await supabaseAdmin
      .from('rooms')
      .insert({
        anime_id: data.animeId,
        episode_id: data.episodeId,
        anime_title: data.animeTitle,
        anime_poster: data.animePoster,
        episode_number: data.episodeNumber,
        host_id: data.hostId,
        host_name: data.hostName,
        category: data.category || 'sub',
        participant_count: 1,
        is_playing: false,
        current_time: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Add host as first participant
    await supabaseAdmin
      .from('room_participants')
      .insert({
        room_id: roomData.id,
        user_id: data.hostId,
        user_name: data.hostName,
      });

    return { id: roomData.id, ...roomData };
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
}

export async function deleteRoom(roomId: string, userId: string) {
  try {
    // Verify host ownership
    const { data: room, error: fetchError } = await supabaseAdmin
      .from('rooms')
      .select('host_id')
      .eq('id', roomId)
      .single();

    if (fetchError || !room) throw new Error('Room not found');
    if (room.host_id !== userId) throw new Error('Unauthorized');

    // Delete participants first
    await supabaseAdmin
      .from('room_participants')
      .delete()
      .eq('room_id', roomId);

    // Delete room
    const { error } = await supabaseAdmin
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Failed to delete room:', error);
    throw error;
  }
}

export async function getActiveRooms(maxRooms: number = 50): Promise<PublicRoom[]> {
  try {
    const { data: rooms, error } = await supabaseAdmin
      .from('rooms')
      .select('*')
      .gt('participant_count', 0)
      .order('participant_count', { ascending: false })
      .limit(maxRooms);

    if (error) throw error;

    return (rooms || []).map(room => ({
      id: room.id,
      animeId: room.anime_id || '',
      animeTitle: room.anime_title || 'Unknown Anime',
      animePoster: room.anime_poster,
      episodeId: room.episode_id || '',
      episodeNumber: room.episode_number || 1,
      hostId: room.host_id || '',
      hostName: room.host_name || 'Anonymous',
      participantCount: room.participant_count || 0,
      isPlaying: room.is_playing || false,
      createdAt: new Date(room.created_at),
      category: room.category,
    }));
  } catch (error) {
    console.error('Error fetching active rooms:', error);
    return [];
  }
}

export async function getRoomById(roomId: string): Promise<PublicRoom | null> {
  try {
    const { data: room, error } = await supabaseAdmin
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error || !room) return null;

    return {
      id: room.id,
      animeId: room.anime_id || '',
      animeTitle: room.anime_title || 'Unknown Anime',
      animePoster: room.anime_poster,
      episodeId: room.episode_id || '',
      episodeNumber: room.episode_number || 1,
      hostId: room.host_id || '',
      hostName: room.host_name || 'Anonymous',
      participantCount: room.participant_count || 0,
      isPlaying: room.is_playing || false,
      createdAt: new Date(room.created_at),
      category: room.category,
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}

export async function getTotalActiveRoomsCount(): Promise<number> {
  try {
    const { count, error } = await supabaseAdmin
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .gt('participant_count', 0);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting rooms count:', error);
    return 0;
  }
}
