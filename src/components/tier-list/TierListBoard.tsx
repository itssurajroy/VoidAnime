'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { 
  DndContext, 
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  rectIntersection
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import html2canvas from 'html2canvas';
import { useHasMounted } from '@/hooks/useHasMounted';
import Image from 'next/image';
import { X, Search, Download, Flame, Plus, Trash2, Sparkles } from 'lucide-react';
import { getTrending, searchAnime } from '@/lib/api/anilist';

import { useKeyPress } from '@/hooks/useKeyPress';

const TIERS = [
  { id: 'S', color: 'bg-[#ff7f7f]', label: 'S' },
  { id: 'A', color: 'bg-[#ffbf7f]', label: 'A' },
  { id: 'B', color: 'bg-[#ffff7f]', label: 'B' },
  { id: 'C', color: 'bg-[#7fff7f]', label: 'C' },
  { id: 'D', color: 'bg-[#7fbfff]', label: 'D' },
  { id: 'F', color: 'bg-[#7f7fff]', label: 'F' },
];

interface AnimeItem {
  id: string;
  tierId: string;
  title: string;
  image: string;
}

function SortableAnimeItem({ id, image, title, onRemove }: { id: string, image: string, title: string, onRemove?: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative group shrink-0"
    >
      <div 
        {...attributes} 
        {...listeners}
        className={`relative w-16 h-24 md:w-24 md:h-36 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing border-2 border-transparent hover:border-anime-primary transition-all shadow-lg bg-[#14111A] ${isDragging ? 'shadow-2xl scale-105 ring-2 ring-anime-primary' : ''}`}
      >
        <Image 
          src={image} 
          alt={title} 
          fill
          unoptimized
          className="object-cover pointer-events-none" 
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
      
      {onRemove && (
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(id); }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg border border-white/20"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

function TierRow({ id, color, items, onRemove }: { id: string, color: string, items: AnimeItem[], onRemove: (id: string) => void }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div className="flex bg-[#1a1a1a] border-b border-[#2a2a2a] min-h-[100px] md:min-h-[144px] group/row touch-none">
      <div className={`w-20 md:w-32 flex items-center justify-center font-black text-2xl md:text-4xl text-black/80 ${color} shrink-0 p-2 text-center select-none uppercase`}>
        {id}
      </div>
      <div ref={setNodeRef} className="flex-1 flex flex-wrap gap-2 p-2 md:p-3 items-center min-h-full">
        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
          {items.map((item, i) => (
            <SortableAnimeItem key={`${item.id}-${i}`} {...item} onRemove={onRemove} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function TierListBoard({ initialItems }: { initialItems: AnimeItem[] }) {
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [trendingResults, setTrendingResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useKeyPress('c', () => {
    if (items.length > 0 && confirm("Clear board?")) setItems([]);
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const trending = await getTrending(1);
        setTrendingResults(trending?.Page?.media || []);
      } catch (e) {
        console.error("Failed to load trending", e);
      }
      
      const saved = localStorage.getItem('voidanime-tierlist');
      if (saved) {
        try { setItems(JSON.parse(saved)); } catch (e) { setItems(initialItems); }
      } else {
        setItems(initialItems);
      }
    };
    loadData();
  }, [initialItems]);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('voidanime-tierlist', JSON.stringify(items));
    }
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await searchAnime(searchQuery, 1);
      setSearchResults(res?.Page?.media || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const addAnimeToBank = (anime: any) => {
    if (items.some(i => i.id === anime.id.toString())) return;
    const newItem: AnimeItem = {
      id: anime.id.toString(),
      tierId: 'UNRANKED',
      title: anime.title.english || anime.title.romaji,
      image: anime.coverImage.extraLarge || anime.coverImage.large
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeAnime = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = items.find(i => i.id === activeId);
    if (!activeItem) return;

    const isOverTier = TIERS.some(t => t.id === overId) || overId === 'UNRANKED';
    
    if (isOverTier) {
      if (activeItem.tierId !== overId) {
        setItems(prev => prev.map(item => 
          item.id === activeId ? { ...item, tierId: overId } : item
        ));
      }
      return;
    }

    const overItem = items.find(i => i.id === overId);
    if (overItem && activeItem.tierId !== overItem.tierId) {
      setItems(prev => prev.map(item => 
        item.id === activeId ? { ...item, tierId: overItem.tierId } : item
      ));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeItem = items.find(i => i.id === activeId);
    const overItem = items.find(i => i.id === overId);

    if (activeItem && overItem && activeItem.tierId === overItem.tierId && activeId !== overId) {
      const oldIndex = items.findIndex(i => i.id === activeId);
      const newIndex = items.findIndex(i => i.id === overId);
      setItems(prev => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const exportAsImage = useCallback(async () => {
    if (!boardRef.current) return;
    try {
      const canvas = await html2canvas(boardRef.current, {
        backgroundColor: '#0A090C',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `voidanime-tierlist-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed', error);
      alert("Export failed. Please try again.");
    }
  }, []);

  const activeItemData = items.find(i => i.id === activeId);
  const hasMounted = useHasMounted();
  const displayItems = hasMounted ? items : initialItems;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-[#1A1A1A]/40 p-6 rounded-[32px] border border-[#2A2A2A] backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-anime-primary/20 border border-anime-primary/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-anime-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-white leading-tight">Tier List Maker</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Persistent • Auto-Save</p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search anime..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-[#2A2A2A] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-anime-primary outline-none transition-all"
            />
          </form>
          <button 
            type="button"
            onClick={exportAsImage}
            className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-anime-primary hover:text-white transition-all shadow-xl"
          >
            <Download className="w-4 h-4" /> Export PNG
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2 text-anime-primary font-black uppercase tracking-widest text-[10px]">
          <Flame className="w-3 h-3" /> Trending Picks (Quick Add)
        </div>
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
          {(searchResults.length > 0 ? searchResults : trendingResults).map(anime => (
            <button 
              key={anime.id} 
              type="button"
              onClick={() => addAnimeToBank(anime)}
              className="relative w-20 md:w-24 aspect-[2/3] shrink-0 rounded-xl overflow-hidden group border border-[#2A2A2A] hover:border-anime-primary transition-all shadow-lg bg-[#1A1A1A]"
            >
              <Image 
                src={anime.coverImage.extraLarge || anime.coverImage.large} 
                alt={anime.title.romaji} 
                fill
                unoptimized
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          ref={boardRef}
          className="flex flex-col border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] bg-[#0A090C]"
        >
          {TIERS.map(tier => (
            <TierRow 
              key={tier.id} 
              id={tier.id} 
              color={tier.color} 
              items={displayItems.filter(i => i.tierId === tier.id)}
              onRemove={removeAnime}
            />
          ))}
        </div>

        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Unranked Bank</h3>
            <button 
              type="button"
              onClick={() => { if(confirm("Clear board?")) setItems([]); }}
              className="text-[10px] font-black text-red-500/50 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-3 h-3" /> Reset Everything
            </button>
          </div>
          
          <SortableContext id="UNRANKED" items={displayItems.filter(i => i.tierId === 'UNRANKED').map(i => i.id)} strategy={rectSortingStrategy}>
            <div 
              id="UNRANKED"
              className="min-h-[200px] p-8 bg-[#1A1A1A]/20 border border-dashed border-[#2A2A2A] rounded-[40px] flex flex-wrap gap-4 items-start content-start touch-none"
            >
              {displayItems.filter(i => i.tierId === 'UNRANKED').map((item, i) => (
                <SortableAnimeItem key={`${item.id}-${i}`} {...item} onRemove={removeAnime} />
              ))}
              {displayItems.filter(i => i.tierId === 'UNRANKED').length === 0 && (
                <div className="w-full flex flex-col items-center justify-center py-10 text-white/10 opacity-50">
                  <Plus className="w-12 h-12 mb-4" />
                  <p className="font-heading font-black text-xl uppercase tracking-tighter">Bank is empty</p>
                  <p className="text-xs">Add more anime using the search or trending bar above</p>
                </div>
              )}
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId && activeItemData ? (
            <div className="w-24 h-36 rounded-lg overflow-hidden shadow-2xl scale-110 opacity-90 cursor-grabbing rotate-3 border-2 border-anime-primary ring-4 ring-anime-primary/20 bg-[#14111A]">
              <Image 
                src={activeItemData.image} 
                alt={activeItemData.title} 
                fill
                unoptimized
                className="object-cover" 
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
