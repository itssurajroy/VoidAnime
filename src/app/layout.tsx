import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import { Toaster } from '@/components/ui/toaster';
import { SupabaseAuthProvider } from '@/hooks/useSupabaseAuth';
import { ThemeStyles } from '@/components/shared/ThemeStyles';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { BackToTop } from '@/components/shared/BackToTop';
import { Analytics } from "@vercel/analytics/next";

import { SettingsProvider } from '@/components/SettingsProvider';


export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: '#9333ea',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

const defaultTheme = {
  primary: '271 91% 65%', // #9333ea purple
  background: '228 18% 5%', // #0B0C10
  accent: '271 91% 65%', // #9333ea purple
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://voidanime.online';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: 'VoidAnime - Watch Anime Online Free',
      template: '%s | VoidAnime',
    },
    description: 'Watch your favorite anime online in HD quality for free. Dubbed and subbed episodes available. No ads, no registration required.',
    applicationName: 'VoidAnime',
    referrer: 'no-referrer',
    keywords: ['anime', 'watch anime', 'anime streaming', 'free anime', 'dubbed anime', 'subbed anime', 'anime online', 'watch anime online'],
    authors: [{ name: 'VoidAnime' }],
    creator: 'VoidAnime',
    publisher: 'VoidAnime',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: 'VoidAnime - Watch Anime Online Free',
      description: 'Watch your favorite anime online in HD quality for free.',
      url: APP_URL,
      siteName: 'VoidAnime',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'VoidAnime - The best place to watch anime online',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'VoidAnime - Watch Anime Online Free',
      description: 'Watch your favorite anime online in HD quality for free.',
      images: ['/og-image.png'],
    },
    verification: {
      google: 'google-site-verification-code',
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/icons/icon-192x192.png',
    },

  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeStyle = `
    :root {
      --primary: ${defaultTheme.primary};
      --background: ${defaultTheme.background};
      --accent: ${defaultTheme.accent};
    }
  `;

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <ThemeStyles css={themeStyle} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;0,900;1,700;1,800;1,900&family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />

      </head>
      <body className="font-body antialiased flex flex-col bg-background min-h-screen overflow-x-hidden" suppressHydrationWarning>
        {/* Skip Link for Accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:font-bold focus:rounded-lg focus:shadow-lg"
        >
          Skip to main content
        </a>
        
        <SettingsProvider>

          <SupabaseAuthProvider>
            <SplashScreen />
            <Header />
            <main id="main-content" className="flex-grow animate-enter flex flex-col">{children}</main>
            <Footer />

            <Toaster />
            <BackToTop />
            <Analytics />
          </SupabaseAuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
