import { TasteOnboarding } from '@/components/gamification/TasteOnboarding';

export const metadata = {
  title: 'Taste Profile Onboarding | VoidAnime',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center pt-20 pb-12 selection:bg-anime-primary/30 relative overflow-hidden">
      {/* Dynamic Background FX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-anime-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <TasteOnboarding />
      </div>
    </div>
  );
}
