'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Sparkles, Heart, Share2, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  topAnime: { id: number; title: string; image: string; score: number }[];
  compatibility: number;
}

const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'AnimeKing99',
    avatar: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535.jpg',
    topAnime: [
      { id: 1535, title: 'Death Note', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535.jpg', score: 10 },
      { id: 21, title: 'One Piece', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-tXMN3Y20PIL9.jpg', score: 9 },
      { id: 5114, title: 'Fullmetal Alchemist: Brotherhood', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114.jpg', score: 10 },
    ],
    compatibility: 87,
  },
  {
    id: '2',
    name: 'OtakuQueen',
    avatar: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg',
    topAnime: [
      { id: 113415, title: 'Jujutsu Kaisen', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg', score: 9 },
      { id: 16498, title: 'Attack on Titan', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-NF7L9N3XAk4y6T6Lh4i0K6g3F.jpg', score: 10 },
      { id: 20464, title: 'Spy x Family', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20464-Zkyy0u84XSw7kfRQuzmu2D6d.jpg', score: 9 },
    ],
    compatibility: 72,
  },
  {
    id: '3',
    name: 'WeebMaster',
    avatar: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-fMPu2GksC4e6F6zdN6Y2t2xa7h.jpg',
    topAnime: [
      { id: 101922, title: 'Mob Psycho 100', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-fMPu2GksC4e6F6zdN6Y2t2xa7h.jpg', score: 10 },
      { id: 1, title: 'Cowboy Bebop', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1.jpg', score: 9 },
      { id: 995, title: 'Great Teacher Onizuka', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx995.jpg', score: 10 },
    ],
    compatibility: 45,
  },
];

const SHARED_ANIME = [
  { title: 'Death Note', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535.jpg' },
  { title: 'Attack on Titan', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-NF7L9N3XAk4y6T6Lh4i0K6g3F.jpg' },
];

const RECOMMENDATIONS_FOR_YOU = [
  { title: 'Hunter x Hunter', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061.jpg' },
  { title: 'Code Geass', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1575.jpg' },
];

export default function CompatibilityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSelectedUser(MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)]);
    setIsSearching(false);
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCompatibilityBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-8 h-8 text-anime-primary" />
            <span className="text-sm font-black uppercase tracking-widest text-zinc-500">Social Feature</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Anime Compatibility
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Find out how compatible you are with friends based on your anime preferences!
          </p>
        </div>

        {!selectedUser ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8">
              <label className="block text-sm font-bold text-white mb-4">
                Enter a username to compare
              </label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter username..."
                    className="w-full pl-12 pr-4 py-4 bg-[#212121] border border-[#2A2A2A] rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-anime-primary"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-8 py-4 bg-anime-primary text-white font-bold rounded-2xl hover:bg-anime-primary/80 transition-all disabled:opacity-50"
                >
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Compare'}
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-[#2A2A2A]">
                <p className="text-sm text-zinc-500 mb-4">Or try a popular user:</p>
                <div className="flex flex-wrap gap-3">
                  {MOCK_USERS.map(user => (
                    <button
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#212121] rounded-xl border border-[#2A2A2A] hover:border-anime-primary transition-all"
                    >
                      <div className="w-6 h-6 rounded-full bg-zinc-700 overflow-hidden">
                        <Image src={user.avatar} alt={user.name} width={24} height={24} className="object-cover" />
                      </div>
                      <span className="text-sm text-white">{user.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="text-sm font-black uppercase tracking-widest text-zinc-500">You & {selectedUser.name}</span>
              </div>
              <div className="relative inline-block">
                <div className={`text-7xl md:text-8xl font-black ${getCompatibilityColor(selectedUser.compatibility)}`}>
                  {selectedUser.compatibility}%
                </div>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full ${getCompatibilityBg(selectedUser.compatibility)} text-white text-xs font-black uppercase`}>
                  Compatible
                </div>
              </div>
              <p className="text-zinc-400 mt-6 max-w-md mx-auto">
                You and {selectedUser.name} have very similar taste in anime!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
                <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500 mb-4">
                  <Sparkles className="w-4 h-4 text-anime-primary" /> Shared Favorites
                </h3>
                <div className="space-y-3">
                  {SHARED_ANIME.map((anime, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#212121] rounded-xl">
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden">
                        <Image src={anime.image} alt={anime.title} fill className="object-cover" />
                      </div>
                      <span className="text-white font-bold">{anime.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
                <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-zinc-500 mb-4">
                  <Heart className="w-4 h-4 text-red-400" /> You'd Love
                </h3>
                <div className="space-y-3">
                  {RECOMMENDATIONS_FOR_YOU.map((anime, i) => (
                    <Link
                      key={i}
                      href="#"
                      className="flex items-center gap-3 p-3 bg-[#212121] rounded-xl hover:bg-[#2A2A2A] transition-all group"
                    >
                      <div className="relative w-12 h-16 rounded-lg overflow-hidden">
                        <Image src={anime.image} alt={anime.title} fill className="object-cover" />
                      </div>
                      <span className="text-white font-bold flex-1 group-hover:text-anime-primary">{anime.title}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-anime-primary" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex items-center gap-2 px-8 py-4 bg-[#212121] border border-[#2A2A2A] text-white font-bold rounded-2xl hover:bg-[#2A2A2A] transition-all"
              >
                Compare Another User
              </button>
              <button className="flex items-center gap-2 px-8 py-4 bg-anime-primary text-white font-bold rounded-2xl hover:bg-anime-primary/80 transition-all">
                <Share2 className="w-5 h-5" /> Share Results
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
