import { Metadata } from 'next';
import { getActiveRooms } from '@/actions/rooms';
import { LobbyClient } from './LobbyClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Watch Together - VoidAnime',
  description: 'Join active watch parties or create your own to watch anime with friends.',
};

export default async function WatchTogetherPage() {
  const rooms = await getActiveRooms(50);

  // Serialize dates for client component
  const serializedRooms = rooms.map(room => ({
    ...room,
    createdAt: room.createdAt instanceof Date ? room.createdAt : new Date(room.createdAt),
  }));

  return <LobbyClient initialRooms={serializedRooms} />;
}
