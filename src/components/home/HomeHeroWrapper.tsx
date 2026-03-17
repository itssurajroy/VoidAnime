'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

interface HomeHeroWrapperProps {
  animeId: number;
}

export function HomeHeroWrapper({ animeId }: HomeHeroWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToList = () => {
    if (!user) {
      if (confirm("You need to be signed in to add anime to your list. Sign in now?")) {
        router.push('/login');
      }
      return;
    }
    // In a real app, this would open the status modal or call an API
    alert("Functionality to add to list will be available soon!");
  };

  return (
    <button 
      onClick={handleAddToList}
      className="flex items-center gap-2 bg-[#1A1A1A]/50 hover:bg-white/10 backdrop-blur-xl border border-[#2A2A2A] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-1 min-h-[44px]"
    >
      <Plus className="w-5 h-5" /> Add to List
    </button>
  );
}
