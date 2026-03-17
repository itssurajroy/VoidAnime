import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "VoidAnime - Track Every Episode. Discover Every Gem.",
  description: "The most powerful free anime & manga tracker ever built. Features AI recommendations, real-time sync, and detailed statistics.",
  keywords: ["anime tracker", "manga tracker", "watch anime", "track anime", "anime list", "manga list", "anime statistics", "anime recommendations"],
  authors: [{ name: "VoidAnime" }],
  creator: "VoidAnime",
  publisher: "VoidAnime",
  metadataBase: new URL('https://voidanime.online'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://voidanime.online",
    siteName: "VoidAnime",
    title: "VoidAnime - Track Every Episode. Discover Every Gem.",
    description: "The most powerful free anime & manga tracker ever built.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VoidAnime"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "VoidAnime - Track Every Episode",
    description: "The most powerful free anime & manga tracker ever built.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VoidAnime",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-[var(--color-dark-bg)]" style={{ backgroundColor: 'var(--color-dark-bg)' }}>
      <head>
        {/* Google Search Console Verification - Replace with your actual code */}
        <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
        
        {/* AdSense Publisher Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=pub-XXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {/* Google Consent Mode v2 Default Deny */}
        <Script id="consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `}
        </Script>
        <meta name="theme-color" content="#050505" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-[var(--color-dark-bg)] text-gray-100 antialiased min-h-[100dvh] flex flex-col selection:bg-anime-primary/30 selection:text-white`}>
        <Navbar />
        <main className="flex-1 w-full flex flex-col pt-16 md:pt-20 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
