import { useState } from 'react';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });

  const set = (v: T | ((val: T) => T)) => {
    const valueToStore = v instanceof Function ? v(value) : v;
    setValue(valueToStore);
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [value, set] as const;
}
