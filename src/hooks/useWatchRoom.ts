'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  limit,
  serverTimestamp,
  getDoc,
  getDocs,
  setDoc,
  increment
} from 'firebase/firestore';
import type { Room, RoomParticipant, RoomChatMessage, PlaybackState, RoomState } from '@/types/room';

const ROOMS_COLLECTION = 'rooms';
const MAX_PARTICIPANTS_DEFAULT = 10;
const SYNC_INTERVAL_MS = 2000;

export function useWatchRoom() {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [roomState, setRoomState] = useState<RoomState>({
    room: null,
    participants: [],
    messages: [],
    status: 'idle',
    error: null,
    isHost: false,
  });

  const roomIdRef = useRef<string | null>(null);
  const unsubscribersRef = useRef<(() => void)[]>([]);
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearRoom = useCallback(() => {
    unsubscribersRef.current.forEach(unsub => unsub());
    unsubscribersRef.current = [];
    
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

  const createRoom = useCallback(async (
    animeId: string,
    episodeId: string,
    animeTitle: string,
    episodeNumber: number,
    serverId?: string,
    category?: 'sub' | 'dub',
    animePoster?: string
  ): Promise<string> => {
    if (!user || !firestore) {
      throw new Error('User must be logged in to create a room');
    }

    const roomsRef = collection(firestore, ROOMS_COLLECTION);
    
     
    const roomData: any = {
      animeId,
      episodeId,
      animeTitle,
      animePoster,
      episodeNumber,
      hostId: user.uid,
      hostName: user.displayName || 'Anonymous',
      createdAt: new Date(),
      createdBy: user.uid,
      isPlaying: false,
      currentTime: 0,
      updatedAt: new Date(),
      maxParticipants: MAX_PARTICIPANTS_DEFAULT,
      participantCount: 1,
    };

    if (serverId) {
        roomData.serverId = serverId;
    }
    if (category) {
        roomData.category = category;
    }

    // Use addDoc for collection to get proper document reference
    const newRoomRef = await addDoc(roomsRef, roomData);
    const newRoomId = newRoomRef.id;

     
    const participantData: any = {
      displayName: user.displayName || 'Anonymous',
      avatarUrl: user.photoURL,
      joinedAt: new Date(),
      isHost: true,
      isReady: false,
    };

    const participantRef = doc(firestore, ROOMS_COLLECTION, newRoomId, 'participants', user.uid);
    await setDoc(participantRef, participantData);

    roomIdRef.current = newRoomId;
    setRoomState(prev => ({
      ...prev,
      status: 'connected',
      isHost: true,
    }));

    return newRoomId;
  }, [user, firestore]);

  const joinRoom = useCallback(async (roomId: string) => {
    if (!user || !firestore) {
      throw new Error('User must be logged in to join a room');
    }

    setRoomState(prev => ({ ...prev, status: 'connecting', error: null }));

    try {
      const roomRef = doc(firestore, ROOMS_COLLECTION, roomId);
      const roomSnap = await getDoc(roomRef);
      
      if (!roomSnap.exists()) {
        throw new Error('Room not found');
      }

      const roomData = roomSnap.data() as Room;

      const participantRef = doc(firestore, ROOMS_COLLECTION, roomId, 'participants', user.uid);
      const participantSnap = await getDoc(participantRef);
      
      if (participantSnap.exists()) {
        await updateDoc(participantRef, { joinedAt: new Date() });
      } else {
         
        const participantData: any = {
          displayName: user.displayName || 'Anonymous',
          avatarUrl: user.photoURL,
          joinedAt: new Date(),
          isHost: false,
          isReady: true,
        };
        await setDoc(participantRef, participantData);
        // Increment count for new participant
        await updateDoc(roomRef, { participantCount: increment(1) });
      }

      roomIdRef.current = roomId;
      
      const unsubRoom = onSnapshot(roomRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Room;
          // Remove id from data to avoid duplication
          const { id: _dataId, ...restData } = data;
          setRoomState(prev => ({
            ...prev,
            room: { id: snap.id, ...restData },
            status: 'connected',
          }));
        }
      });
      unsubscribersRef.current.push(unsubRoom);

      const participantsRef = collection(firestore, ROOMS_COLLECTION, roomId, 'participants');
      const unsubParticipants = onSnapshot(participantsRef, (snapshot) => {
        const participants = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as RoomParticipant));
        setRoomState(prev => ({ ...prev, participants }));
      });
      unsubscribersRef.current.push(unsubParticipants);

      const messagesRef = collection(firestore, ROOMS_COLLECTION, roomId, 'chat');
      const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));
      const unsubMessages = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as RoomChatMessage));
        setRoomState(prev => ({ ...prev, messages }));
      });
      unsubscribersRef.current.push(unsubMessages);

      setRoomState(prev => ({
        ...prev,
        status: 'connected',
        isHost: roomData.hostId === user.uid,
      }));

      return roomId;
    } catch (error) {
      setRoomState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Failed to join room' 
      }));
      throw error;
    }
  }, [user, firestore]);

  const leaveRoom = useCallback(async () => {
    if (!user || !firestore || !roomIdRef.current) return;

    const roomId = roomIdRef.current;
    
    try {
      const roomRef = doc(firestore, ROOMS_COLLECTION, roomId);
      const participantRef = doc(firestore, ROOMS_COLLECTION, roomId, 'participants', user.uid);
      await deleteDoc(participantRef);
      
      const roomSnap = await getDoc(roomRef);
      
      if (roomSnap.exists()) {
        const roomData = roomSnap.data() as Room;
        const currentCount = roomData.participantCount || 0;

        if (currentCount <= 1) {
          await deleteDoc(roomRef);
        } else {
          // Decrement count
          await updateDoc(roomRef, { 
            participantCount: increment(-1),
            updatedAt: serverTimestamp()
          });

          // Handover host if leaving user was host
          if (roomData.hostId === user.uid) {
            const participantsRef = collection(firestore, ROOMS_COLLECTION, roomId, 'participants');
            const participantsSnap = await getDocs(participantsRef);
            const participants = participantsSnap.docs.map(d => ({
              id: d.id,
              ...d.data()
            } as RoomParticipant));
            
            if (participants.length > 0) {
              const newHost = participants[0];
              await updateDoc(roomRef, { 
                hostId: newHost.id,
                hostName: newHost.displayName
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error leaving room:', error);
    } finally {
      clearRoom();
    }
  }, [user, firestore, clearRoom]);

  const updatePlaybackState = useCallback(async (state: Partial<PlaybackState>) => {
    if (!user || !firestore || !roomIdRef.current || !roomState.isHost) return;

    const roomRef = doc(firestore, ROOMS_COLLECTION, roomIdRef.current);
    
    try {
      await updateDoc(roomRef, {
        ...state,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating playback state:', error);
    }
  }, [user, firestore, roomState.isHost]);

  const syncPlaybackState = useCallback(async () => {
    if (!user || !firestore || !roomIdRef.current || roomState.isHost) return;
    if (!roomState.room) return;

    const roomRef = doc(firestore, ROOMS_COLLECTION, roomIdRef.current);
    const roomSnap = await getDoc(roomRef);
    
    if (roomSnap.exists()) {
      const data = roomSnap.data() as Room;
      setRoomState(prev => ({
        ...prev,
        room: { ...prev.room!, currentTime: data.currentTime, isPlaying: data.isPlaying },
      }));
    }
  }, [user, firestore, roomState.isHost, roomState.room]);

  const sendMessage = useCallback(async (message: string) => {
    if (!user || !firestore || !roomIdRef.current || !message.trim()) return;

    const messagesRef = collection(firestore, ROOMS_COLLECTION, roomIdRef.current, 'chat');
    
    await addDoc(messagesRef, {
      userId: user.uid,
      displayName: user.displayName || 'Anonymous',
      avatarUrl: user.photoURL,
      message: message.trim(),
      timestamp: serverTimestamp(),
    });
  }, [user, firestore]);

  const kickParticipant = useCallback(async (participantId: string) => {
    if (!user || !firestore || !roomIdRef.current || !roomState.isHost) return;
    
    try {
      const roomRef = doc(firestore, ROOMS_COLLECTION, roomIdRef.current);
      const participantRef = doc(firestore, ROOMS_COLLECTION, roomIdRef.current, 'participants', participantId);
      await deleteDoc(participantRef);
      await updateDoc(roomRef, { participantCount: increment(-1) });
    } catch (error) {
      console.error('Error kicking participant:', error);
    }
  }, [user, firestore, roomState.isHost]);

  const togglePlayPause = useCallback(async () => {
    if (!user || !firestore || !roomIdRef.current || !roomState.isHost || !roomState.room) return;
    
    const newIsPlaying = !roomState.room.isPlaying;
    const roomRef = doc(firestore, ROOMS_COLLECTION, roomIdRef.current);
    
    try {
      await updateDoc(roomRef, {
        isPlaying: newIsPlaying,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }, [user, firestore, roomState.isHost, roomState.room]);

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
