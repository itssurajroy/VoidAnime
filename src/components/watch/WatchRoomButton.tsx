'use client';

import { Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createRoom } from '@/actions/rooms';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface WatchRoomButtonProps {
  animeId: string;
  episodeId: string;
  animeTitle: string;
  animePoster: string;
  episodeNumber: number;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  iconOnly?: boolean;
}

export function WatchRoomButton({
  animeId,
  episodeId,
  animeTitle,
  animePoster,
  episodeNumber,
  className,
  variant = 'default',
  iconOnly = false
}: WatchRoomButtonProps) {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'You must be logged in to create a watch party.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const room = await createRoom({
        animeId,
        episodeId,
        animeTitle,
        animePoster,
        episodeNumber,
        hostId: user.id,
        hostName: user.user_metadata?.username || 'Host',
      });

      toast({
        title: 'Room Created!',
        description: 'Redirecting to your watch party...',
      });

      router.push(`/watch-together/${room.id}`);
    } catch (error) {
      console.error('Failed to create room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create watch party. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={cn("gap-2", className)}
      onClick={handleCreateRoom}
      disabled={isCreating}
    >
      {isCreating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Users className="w-4 h-4" />
      )}
      {!iconOnly && (isCreating ? 'Creating...' : 'Watch Party')}
    </Button>
  );
}
