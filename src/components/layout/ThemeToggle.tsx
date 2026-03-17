'use client';

import { useUiStore } from '@/store/uiStore';
import { Sun, Moon, Laptop } from 'lucide-react';
import type { ThemeMode } from '@/types/user';
import { useHasMounted } from '@/hooks/useHasMounted';

const THEMES: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'dark', label: 'Dark', icon: Moon },
  { mode: 'amoled', label: 'AMOLED', icon: Laptop },
];

export function ThemeToggle() {
  const { theme, setTheme } = useUiStore();
  const hasMounted = useHasMounted();

  const current = THEMES.find((t) => t.mode === theme) ?? THEMES[1];
  const Icon = hasMounted ? current.icon : Moon; // Default to Dark on server

  const next = () => {
    if (!hasMounted) return;
    const idx = THEMES.findIndex((t) => t.mode === theme);
    setTheme(THEMES[(idx + 1) % THEMES.length].mode);
  };

  return (
    <button
      onClick={next}
      title={`Current: ${current.label} — Click to switch`}
      className="rounded-lg p-2 text-white/50 transition-all hover:bg-[#212121] hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
