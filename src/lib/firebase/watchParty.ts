import { db } from './firestore';
import { collection, doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';

export interface WatchPartyRoom {
  id: string;
  hostUid: string;
  mediaId: number;
  mediaTitle: string;
  mediaCover: string;
  episode: number;
  currentTime: number;
  isPlaying: boolean;
  participants: string[]; // array of uids
  createdAt: string;
}

export async function createWatchParty(hostUid: string, mediaData: any, episode: number) {
  const roomRef = doc(collection(db, 'watchParties'));
  const roomData: WatchPartyRoom = {
    id: roomRef.id,
    hostUid,
    mediaId: mediaData.id,
    mediaTitle: mediaData.title.english || mediaData.title.romaji,
    mediaCover: mediaData.coverImage.large,
    episode,
    currentTime: 0,
    isPlaying: false,
    participants: [hostUid],
    createdAt: new Date().toISOString()
  };
  await setDoc(roomRef, roomData);
  return roomRef.id;
}

export async function joinWatchParty(roomId: string, uid: string) {
  const roomRef = doc(db, 'watchParties', roomId);
  const snap = await getDoc(roomRef);
  if (snap.exists()) {
    const participants = snap.data().participants || [];
    if (!participants.includes(uid)) {
      await updateDoc(roomRef, {
        participants: [...participants, uid]
      });
    }
  }
}

export function subscribeToRoom(roomId: string, callback: (data: WatchPartyRoom) => void) {
  return onSnapshot(doc(db, 'watchParties', roomId), (doc) => {
    if (doc.exists()) {
      callback(doc.data() as WatchPartyRoom);
    }
  });
}

export async function updateRoomSync(roomId: string, data: Partial<WatchPartyRoom>) {
  const roomRef = doc(db, 'watchParties', roomId);
  await updateDoc(roomRef, data);
}
