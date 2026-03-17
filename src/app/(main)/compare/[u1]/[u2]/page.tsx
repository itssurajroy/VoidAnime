import { UserComparison } from '@/components/user/UserComparison';

const MOCK_USER_1 = {
  username: 'VoidTraveler',
  avatar: 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png',
  avgScore: 8.2,
  totalWatched: 142,
  topGenres: ['Action', 'Psychological'],
  list: [
    { id: 113415, title: 'Jujutsu Kaisen', score: 9, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg' },
    { id: 1535, title: 'Death Note', score: 10, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-4rHwQscM0t3z.jpg' },
    { id: 16498, title: 'Attack on Titan', score: 9, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-m5ZMNtFioc7j.jpg' },
  ]
};

const MOCK_USER_2 = {
  username: 'AnimeMaster',
  avatar: 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/default.png',
  avgScore: 7.5,
  totalWatched: 310,
  topGenres: ['Shonen', 'Adventure'],
  list: [
    { id: 113415, title: 'Jujutsu Kaisen', score: 7, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg' },
    { id: 1535, title: 'Death Note', score: 8, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-4rHwQscM0t3z.jpg' },
    { id: 21, title: 'One Piece', score: 10, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-tXMN3Y20PIL9.jpg' },
  ]
};

export default async function ComparePage({ params }: { params: Promise<{ u1: string, u2: string }> }) {
  const { u1, u2 } = await params;

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 md:px-12 max-w-5xl">
        <div className="mb-12 text-center animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Battle of <span className="glow-text">Taste</span>.
          </h1>
          <p className="text-zinc-400 font-medium">Comparing {u1} vs {u2}</p>
        </div>

        <UserComparison user1={MOCK_USER_1} user2={MOCK_USER_2} />
      </div>
    </div>
  );
}
