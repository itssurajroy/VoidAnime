import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-60px)] px-4 bg-gradient-to-b from-[#0a1628] to-[#0e0f11]">
      <div className="max-w-md w-full bg-[#202125] rounded-[20px] p-10 text-center shadow-2xl border border-white/5">
        <div className="relative w-[200px] h-[200px] mx-auto mb-8">
          <Image 
            src="/404-character.png" 
            alt="404" 
            fill 
            className="object-contain"
          />
        </div>
        
        <h1 className="text-white text-[32px] font-black uppercase mb-2">Oops! 404</h1>
        <p className="text-[#a0a0a0] text-[16px] font-bold mb-10 uppercase tracking-widest">404 Not Found</p>
        
        <Link href="/home">
          <button className="bg-[#8b5cf6] hover:brightness-110 text-white font-black h-[50px] px-10 rounded-full transition-all uppercase tracking-wider">
            &larr; Go home
          </button>
        </Link>
      </div>
    </div>
  );
}
