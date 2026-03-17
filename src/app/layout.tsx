import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import { Toaster } from '@/components/ui/toaster';
import { FirebaseWrapper } from '@/components/FirebaseWrapper';
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
      default: 'VoidAnime',
      template: '%s | VoidAnime',
    },
    description: 'Watch your favorite anime online in HD quality for free. Dubbed and subbed episodes available. No ads, no registration required.',
    applicationName: 'VoidAnime',
    referrer: 'no-referrer',
    openGraph: {
      title: 'VoidAnime',
      description: 'Watch your favorite anime online in HD quality for free.',
      url: APP_URL,
      siteName: 'VoidAnime',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'VoidAnime - The best place to watch anime online',
        },
      ],
      locale: 'en_US',
      type: 'website',
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
        <SettingsProvider>

          <SplashScreen />
          <FirebaseWrapper>
            <Header />
            <main className="flex-grow animate-enter flex flex-col">{children}</main>
            <Footer />

            <Toaster />
            <BackToTop />
            <Analytics />
          </FirebaseWrapper>
        </SettingsProvider>
      </body>
    </html>
  );
}
