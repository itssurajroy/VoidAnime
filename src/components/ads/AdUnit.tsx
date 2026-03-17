'use client';

import { useEffect, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import { useHasMounted } from '@/hooks/useHasMounted';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  layoutKey?: string;
  className?: string;
}

export function AdUnit({ slot, format = 'auto', layoutKey, className = '' }: AdUnitProps) {
  const isPro = useUserStore((state) => state.isPro);
  const isLoaded = useRef(false);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (!hasMounted || isPro) return;

    try {
      if (!isLoaded.current && typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense push error:', error);
    }
  }, [isPro]);

  if (isPro) {
    return null;
  }

  return (
    <div className={`flex w-full justify-center overflow-hidden my-4 ${className}`} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="pub-XXXXXXXX" // Replace with actual Publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        data-full-width-responsive="true"
      />
    </div>
  );
}
