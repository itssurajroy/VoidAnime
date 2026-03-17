'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'amoled');
    if (theme === 'dark') root.classList.add('dark');
    if (theme === 'amoled') root.classList.add('amoled');
  }, [theme]);

  return <>{children}</>;
}
