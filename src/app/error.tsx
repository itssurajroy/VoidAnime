'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
