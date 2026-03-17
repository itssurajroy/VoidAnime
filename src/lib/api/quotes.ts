const ANIMECHAN_BASE = 'https://animechan.io/api/v1';

export interface AnimeQuote {
  id: string;
  quote: string;
  character: { name: string; anime: { name: string } };
}

export async function fetchDailyQuote(): Promise<AnimeQuote | null> {
  try {
    const res = await fetch(`${ANIMECHAN_BASE}/quotes/random`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<AnimeQuote>;
  } catch {
    return null;
  }
}

export async function fetchRandomQuotes(count: number = 10): Promise<AnimeQuote[]> {
  try {
    const res = await fetch(`${ANIMECHAN_BASE}/quotes?limit=${count}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}
