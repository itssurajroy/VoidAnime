import { db } from '@/lib/firebase-admin';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://voidanime.online';

export interface SeoSettings {
  metaTitleSuffix: string;
  metaDescription: string;
  googleVerification: string;
  bingVerification: string;
  orgSchema: string;
  robotsTxt: string;
}

const COLLECTION = 'settings';
const DOC_ID = 'seo';

const DEFAULT_SETTINGS: SeoSettings = {
  metaTitleSuffix: '| VoidAnime',
  metaDescription: 'Watch your favorite anime online in HD quality for free. Dubbed and subbed episodes available. No ads, no registration required.',
  googleVerification: '',
  bingVerification: '',
  orgSchema: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VoidAnime",
  "url": "${APP_URL}",
  "logo": "${APP_URL}/logo.png"
}`,
  robotsTxt: `User-agent: *
Allow: /
Disallow: /admin
Sitemap: ${APP_URL}/sitemap.xml`
};

export async function getSeoSettings(): Promise<SeoSettings> {
  if (!db) return DEFAULT_SETTINGS;
  try {
    const doc = await db.collection(COLLECTION).doc(DOC_ID).get();
    if (!doc.exists) {
        await db.collection(COLLECTION).doc(DOC_ID).set(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...doc.data() } as SeoSettings;
  } catch (e) {
    console.error('Error fetching SEO settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSeoSettings(newSettings: Partial<SeoSettings>) {
    if (!db) return { success: false, error: 'Database not initialized' };
    try {
        await db.collection(COLLECTION).doc(DOC_ID).set(newSettings, { merge: true });
        return { success: true };
    } catch (e) {
        console.error('Error saving SEO settings:', e);
        return { success: false, error: 'Failed to save settings' };
    }
}
