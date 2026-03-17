'use server';

import { db } from '@/lib/firebase-admin';
import { firestore } from 'firebase-admin';

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
  if (!db) throw new Error('Database not initialized');

  try {
    const roomRef = db.collection('rooms').doc();
    const roomData = {
      ...data,
      participantCount: 1,
      isPlaying: false,
      currentTime: 0,
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastUpdated: firestore.FieldValue.serverTimestamp(),
    };

    await roomRef.set(roomData);

    // Add host as first participant
    await roomRef.collection('participants').doc(data.hostId).set({
      userId: data.hostId,
      userName: data.hostName,
      joinedAt: firestore.FieldValue.serverTimestamp(),
      lastSeen: firestore.FieldValue.serverTimestamp(),
    });

    return { id: roomRef.id, ...roomData };
  } catch (error) {
    console.error('Failed to create room:', error);
    throw error;
  }
}

export async function deleteRoom(roomId: string, userId: string) {
  if (!db) throw new Error('Database not initialized');

  try {
    const roomRef = db.collection('rooms').doc(roomId);
    const roomSnap = await roomRef.get();

    if (!roomSnap.exists) throw new Error('Room not found');
    if (roomSnap.data()?.hostId !== userId) throw new Error('Unauthorized');

    await roomRef.delete();
    return { success: true };
  } catch (error) {
    console.error('Failed to delete room:', error);
    throw error;
  }
}

export async function getActiveRooms(maxRooms: number = 50): Promise<PublicRoom[]> {
  if (!db) return [];
  
  try {
    const roomsRef = db.collection('rooms');
    const roomsSnap = await roomsRef.where('participantCount', '>', 0).orderBy('participantCount', 'desc').limit(maxRooms).get();
    
    const rooms: PublicRoom[] = roomsSnap.docs.map(roomDoc => {
      const roomData = roomDoc.data();
      return {
        id: roomDoc.id,
        animeId: roomData.animeId || '',
        animeTitle: roomData.animeTitle || 'Unknown Anime',
        animePoster: roomData.animePoster,
        episodeId: roomData.episodeId || '',
        episodeNumber: roomData.episodeNumber || 1,
        hostId: roomData.hostId || '',
        hostName: roomData.hostName || 'Anonymous',
        participantCount: roomData.participantCount || 0,
        isPlaying: roomData.isPlaying || false,
        createdAt: roomData.createdAt?.toDate() || new Date(),
        category: roomData.category,
      };
    });
    
    return rooms;
  } catch (error) {
    console.error('Error fetching active rooms:', error);
    return [];
  }
}

export async function getRoomById(roomId: string): Promise<PublicRoom | null> {
  if (!db) return null;
  
  try {
    const roomRef = db.collection('rooms').doc(roomId);
    const roomSnap = await roomRef.get();
    
    if (!roomSnap.exists) {
      return null;
    }
    
    const roomData = roomSnap.data();
    
    return {
      id: roomSnap.id,
      animeId: roomData?.animeId || '',
      animeTitle: roomData?.animeTitle || 'Unknown Anime',
      animePoster: roomData?.animePoster,
      episodeId: roomData?.episodeId || '',
      episodeNumber: roomData?.episodeNumber || 1,
      hostId: roomData?.hostId || '',
      hostName: roomData?.hostName || 'Anonymous',
      participantCount: roomData?.participantCount || 0,
      isPlaying: roomData?.isPlaying || false,
      createdAt: roomData?.createdAt?.toDate() || new Date(),
      category: roomData?.category,
    };
  } catch (error) {
    console.error('Error fetching room:', error);
    return null;
  }
}

export async function getTotalActiveRoomsCount(): Promise<number> {
  if (!db) return 0;
  try {
    const roomsRef = db.collection('rooms');
    const snapshot = await roomsRef.where('participantCount', '>', 0).count().get();
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting rooms count:', error);
    return 0;
  }
}
