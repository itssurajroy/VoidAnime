import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const TierListBoard = dynamic(
  () => import('@/components/tier-list/TierListBoard').then(mod => mod.TierListBoard),
  { loading: () => <div className="h-[600px] skeleton rounded-xl" /> }
);

// Mock data to demonstrate the tier list functionality 
// In a real scenario, this fetches the user's completed list
const MOCK_ITEMS = [
  { id: '113415', tierId: 'UNRANKED', title: 'Jujutsu Kaisen', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg' },
  { id: '21', tierId: 'UNRANKED', title: 'One Piece', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx21-tXMN3Y20PIL9.jpg' },
  { id: '16498', tierId: 'UNRANKED', title: 'Attack on Titan', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx16498-m5ZMNtFioc7j.jpg' },
  { id: '1535', tierId: 'UNRANKED', title: 'Death Note', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1535-4rHwQscM0t3z.jpg' },
  { id: '101922', tierId: 'UNRANKED', title: 'Demon Slayer', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101922-PEn1CTc93DQl.jpg' },
  { id: '11061', tierId: 'UNRANKED', title: 'Hunter x Hunter', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx11061-sIoNOi9R2E1k.jpg' },
  { id: '5114', tierId: 'UNRANKED', title: 'FMAB', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx5114-KjtQz9AImAlm.jpg' },
  { id: '9253', tierId: 'UNRANKED', title: 'Steins;Gate', image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-1Qn7MIs2D48E.png' }
];

export default function TierListPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-28 pb-20 selection:bg-anime-primary/30">
      <div className="container mx-auto px-4 md:px-12">
        <div className="mb-10 max-w-3xl animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4 leading-tight drop-shadow-xl">
            Create Your <span className="glow-text">Masterpiece</span>.
          </h1>
          <p className="text-lg text-white/50 font-medium leading-relaxed">
            Drag and drop your completed anime to rank them. Once finished, export your list as an image and share it with the world!
          </p>
        </div>

        <Suspense fallback={<div className="h-[600px] skeleton rounded-xl" />}>
          <TierListBoard initialItems={MOCK_ITEMS} />
        </Suspense>
      </div>
    </div>
  );
}
