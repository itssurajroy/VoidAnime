import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getRoomById } from '@/actions/rooms';
import { RoomClient } from './RoomClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ roomId: string }> }): Promise<Metadata> {
    const { roomId } = await params;
    try {
        const room = await getRoomById(roomId);
        if (!room) return { title: 'Room Not Found' };
        return {
            title: `${room.animeTitle} — Watch Party — VoidAnime`,
            description: `Join ${room.hostName}'s watch party for ${room.animeTitle} Episode ${room.episodeNumber}`,
        };
    } catch {
        return { title: 'Watch Party' };
    }
}

export default async function WatchTogetherRoomPage({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;

    const room = await getRoomById(roomId);
    if (!room) return notFound();

    return <RoomClient roomId={roomId} initialRoom={room} />;
}
