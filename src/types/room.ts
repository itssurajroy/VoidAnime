export interface Room {
  id: string;
  animeId: string;
  episodeId: string;
  animeTitle: string;
  episodeNumber: number;
  hostId: string;
  hostName: string;
  createdAt: Date;
  createdBy: string;
  isPlaying: boolean;
  currentTime: number;
  updatedAt: Date;
  maxParticipants: number;
  serverId?: string;
  category?: 'sub' | 'dub';
}

export interface RoomParticipant {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  joinedAt: Date;
  isHost: boolean;
  isReady: boolean;
}

export interface RoomChatMessage {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  message: string;
  timestamp: Date;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  episodeId: string;
  serverId?: string;
  category?: 'sub' | 'dub';
  updatedAt: Date;
  updatedBy: string;
}

export type RoomStatus = 'idle' | 'connecting' | 'connected' | 'error';

export interface RoomState {
  room: Room | null;
  participants: RoomParticipant[];
  messages: RoomChatMessage[];
  status: RoomStatus;
  error: string | null;
  isHost: boolean;
}
