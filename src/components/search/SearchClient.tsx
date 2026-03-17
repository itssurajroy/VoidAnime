'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';

interface SearchClientProps {
  initialQuery?: string;
}

export function SearchClient({ initialQuery = '' }: SearchClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative group/search max-w-2xl">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/search:text-primary transition-all duration-300 z-10">
        <Search className="h-6 w-6" />
      </div>
      <Input
        id="search-page-input"
        name="q"
        type="search"
        placeholder="Search for your favorite anime..."
        className="h-16 text-[18px] pl-16 pr-24 bg-card/80 backdrop-blur-xl border border-white/5 rounded-[24px] focus:border-primary/50 focus:ring-8 focus:ring-primary/10 transition-all duration-500 placeholder:text-white/10 font-bold shadow-2xl"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button 
          type="submit" 
          className="h-10 px-6 bg-primary hover:bg-primary/90 text-black font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          SEARCH
        </Button>
      </div>
    </form>
  );
}
