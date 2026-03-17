'use client';

import { useState, useMemo } from 'react';
import { ListCard } from '@/components/list/ListCard';
import { StatusModal } from '@/components/list/StatusModal';
import { useListStore } from '@/store/listStore';
import { LayoutList, Search, Filter } from 'lucide-react';
import { WatchStatus } from '@/types/user';

export default function MyListPage() {
  const { entries, upsertEntry } = useListStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<WatchStatus | 'ALL'>('ALL');

  const listArray = useMemo(() => {
    return Object.values(entries);
  }, [entries]);

  const filteredList = useMemo(() => {
    return listArray.filter(entry => {
      const matchesSearch = !filter || 
        (entry.title?.toLowerCase().includes(filter.toLowerCase()));
      const matchesStatus = statusFilter === 'ALL' || entry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [listArray, filter, statusFilter]);

  const handleIncrement = (id: number) => {
    const entry = entries[id];
    if (!entry) return;
    
    const newProgress = entry.progress + 1;
    const shouldComplete = entry.totalEpisodes && newProgress >= entry.totalEpisodes;
    
    upsertEntry({
      ...entry,
      progress: newProgress,
      status: shouldComplete ? 'COMPLETED' : entry.status
    });
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const closeEdit = () => setEditingId(null);

  const handleSaveStatus = async (data: { progress: number; status: WatchStatus; score?: number; rewatches?: number }) => {
    if (!editingId) return;
    
    const entry = entries[editingId];
    if (!entry) return;
    
    await upsertEntry({
      ...entry,
      progress: data.progress,
      status: data.status,
      score: data.score || 0,
      rewatches: data.rewatches || 0
    });
    closeEdit();
  };

  const editingAnime = editingId ? {
    id: editingId,
    title: entries[editingId]?.title || 'Unknown',
    totalEpisodes: entries[editingId]?.totalEpisodes,
    status: entries[editingId]?.status || 'WATCHING',
    progress: entries[editingId]?.progress || 0
  } : null;

  const statusTabs: { value: WatchStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'WATCHING', label: 'Watching' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PLANNING', label: 'Planning' },
    { value: 'PAUSED', label: 'Paused' },
    { value: 'DROPPED', label: 'Dropped' },
  ];

  if (listArray.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-dark-bg)] pt-24 sm:pt-28 pb-20 selection:bg-anime-primary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 animate-slide-up">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel text-zinc-300 font-bold text-sm tracking-widest uppercase mb-4 shadow-xl">
                <LayoutList className="w-4 h-4 text-anime-primary" />
                Tracking Center
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-heading font-black text-white leading-tight drop-shadow-xl">
                My <span className="glow-text">Watchlist</span>.
              </h1>
            </div>
          </div>

          <div className="text-center py-32 border border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
            <LayoutList className="w-20 h-20 text-white/10 mx-auto mb-6" />
            <h3 className="text-2xl font-heading font-black text-white/40 mb-2 uppercase tracking-tight">No Items Yet</h3>
            <p className="text-white/20 text-sm max-w-xs mx-auto">Start tracking your anime journey by adding shows to your list.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] pt-24 sm:pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 animate-slide-up">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel text-zinc-300 font-bold text-sm tracking-widest uppercase mb-4 shadow-xl">
              <LayoutList className="w-4 h-4 text-anime-primary" />
              Tracking Center
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-heading font-black text-white leading-tight drop-shadow-xl">
              My <span className="glow-text">Watchlist</span>.
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Filter list..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="glass-panel rounded-xl py-2 pl-9 pr-4 text-base text-white focus:border-anime-primary outline-none w-full md:w-48 transition-all min-h-[44px] shadow-lg placeholder:text-zinc-500"
              />
            </div>
            <button className="p-3 min-h-[44px] min-w-[44px] rounded-xl glass-panel hover:text-white hover:border-anime-primary/50 transition-colors flex items-center justify-center shadow-lg">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
          {statusTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                statusFilter === tab.value
                  ? 'bg-anime-primary text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2 mb-2 flex items-center gap-2">
             Mobile Tip <span className="w-1 h-1 bg-white/30 rounded-full" /> Swipe Right to +1 EP <span className="w-1 h-1 bg-white/30 rounded-full" /> Swipe Left to Edit
          </p>

          <div className="flex flex-col gap-3">
            {filteredList.map(item => (
              <ListCard 
                key={item.anilistId}
                id={item.anilistId}
                title={item.title || `Anime ${item.anilistId}`}
                image={item.coverImage || ''}
                progress={item.progress}
                totalEpisodes={item.totalEpisodes ?? item.totalEp}
                status={item.status}
                onIncrement={handleIncrement}
                onEdit={handleEdit}
              />
            ))}
          </div>

          {filteredList.length === 0 && (
            <div className="text-center py-20 border border-dashed border-white/5 rounded-[40px] bg-white/[0.02]">
              <Search className="w-16 h-16 text-white/10 mx-auto mb-6" />
              <h3 className="text-xl font-heading font-black text-white/40 mb-2 uppercase tracking-tight">No Matches</h3>
              <p className="text-white/20 text-sm">Try adjusting your filters.</p>
            </div>
          )}
        </div>

      </div>

      {editingAnime && (
        <StatusModal 
          isOpen={!!editingId}
          onClose={closeEdit}
          animeId={editingAnime.id}
          animeTitle={editingAnime.title}
          totalEpisodes={editingAnime.totalEpisodes || undefined}
          initialData={{
            status: editingAnime.status,
            progress: editingAnime.progress
          }}
          onSave={handleSaveStatus}
        />
      )}
    </div>
  );
}
