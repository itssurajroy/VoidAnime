'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div>
        <h2 className="font-heading text-2xl font-bold text-white">Something went wrong</h2>
        <p className="mt-2 text-sm text-zinc-400">{error.message ?? 'An unexpected error occurred.'}</p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-xl bg-anime-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-anime-primary/90"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}
