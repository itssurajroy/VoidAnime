import { db } from '@/lib/firebase-admin';
import type { SiteConfig as AppSiteConfig, NavLink as AppNavLink, SocialLink as AppSocialLink, NavLink, SocialLink } from '@/types/site';
import type { NavLink as DbNavLink } from '@/types/db';

export type SiteConfig = AppSiteConfig;

const COLLECTION = 'site_config';
const DOC_ID = 'default';

const DEFAULT_CONFIG: SiteConfig = {
  siteName: 'VoidAnime',
  tagline: 'Watch Anime Online in HD',
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  theme: {
    primary: '258 90% 66%',
    background: '240 10% 4%',
    accent: '258 89% 59%',
  },
  announcement: {
    enabled: false,
    message: 'Welcome to VoidAnime!',
  },
  shareStats: {
    facebook: '0',
    twitter: '0',
    telegram: '0',
    whatsapp: '0',
    total: '0',
  },
  navLinks: [
    { id: 1, text: 'Home', url: '/home', icon: 'Home' },
    { id: 2, text: 'Movies', url: '/movies', icon: 'Film' },
    { id: 3, text: 'TV Series', url: '/tv', icon: 'Tv' },
    { id: 4, text: 'Most Popular', url: '/category/most-popular', icon: 'Star' },
    { id: 5, text: 'Top Airing', url: '/top-airing', icon: 'Zap' },
    { id: 6, text: 'News', url: '/news', icon: 'Rss' },
  ],
  socialLinks: [
    { id: 1, name: 'Discord', url: '#', icon: 'Send' },
    { id: 2, name: 'Telegram', url: '#', icon: 'Send' },
    { id: 3, name: 'Reddit', url: '#', icon: 'Rss' },
    { id: 4, name: 'Twitter', url: '#', icon: 'Twitter' },
  ],
  cryptoDonations: [],
  header: {
      navLinks: [],
  },
  footer: {
      navLinks: [],
      socialLinks: [],
  }
};

// Map internal structure to documented structure
function hydrateConfig(data: any): SiteConfig {
    const config = { ...DEFAULT_CONFIG, ...data };
    config.header = { navLinks: config.navLinks || [] };
    config.footer = { 
        navLinks: config.navLinks || [],
        socialLinks: config.socialLinks || []
    };
    config.cryptoDonations = config.cryptoDonations || [];
    return config;
}

export async function getSiteConfig(): Promise<SiteConfig> {
    if (!db) return DEFAULT_CONFIG;
    try {
        const doc = await db.collection(COLLECTION).doc(DOC_ID).get();
        if (!doc.exists) {
            await db.collection(COLLECTION).doc(DOC_ID).set(DEFAULT_CONFIG);
            return hydrateConfig(DEFAULT_CONFIG);
        }
        return hydrateConfig(doc.data());
    } catch (e) {
        console.error('Error fetching site config:', e);
        return DEFAULT_CONFIG;
    }
}

export async function getRawNavLinks(): Promise<DbNavLink[]> {
    const config = await getSiteConfig();
    return config.navLinks.map((link: NavLink, index: number) => ({ ...link, icon: null, order: index, location: 'HEADER' as const }));
}

export async function getRawSocialLinks(): Promise<DbNavLink[]> {
    const config = await getSiteConfig();
    return config.socialLinks.map((link: SocialLink) => ({ id: link.id, text: link.name, url: link.url, icon: link.icon, order: link.id, location: 'FOOTER_SOCIAL' as const }));
}

export async function updateConfig(newConfig: Partial<Omit<SiteConfig, 'theme' | 'announcement' | 'header' | 'footer'>>) {
    if (!db) return;
    await db.collection(COLLECTION).doc(DOC_ID).set(newConfig, { merge: true });
}

export async function updateTheme(theme: Partial<SiteConfig['theme']>) {
    if (!db) return;
    await db.collection(COLLECTION).doc(DOC_ID).set({ theme }, { merge: true });
}

export async function updateAnnouncement(announcement: Partial<SiteConfig['announcement']>) {
    if (!db) return;
    await db.collection(COLLECTION).doc(DOC_ID).set({ announcement }, { merge: true });
}

export async function updateShareStats(stats: Partial<NonNullable<SiteConfig['shareStats']>>) {
    if (!db) return;
    await db.collection(COLLECTION).doc(DOC_ID).set({ shareStats: stats }, { merge: true });
}

export async function saveNavLink(link: Omit<AppNavLink, 'id' | 'order'> & {id?: number}) {
    if (!db) return;
    const config = await getSiteConfig();
    const navLinks = [...config.navLinks];
    
    if (link.id && link.id !== -1) {
        const index = navLinks.findIndex((l: NavLink) => l.id === link.id);
        if (index > -1) {
            navLinks[index] = { ...navLinks[index], ...link } as NavLink;
        }
    } else {
        const newId = Math.max(0, ...navLinks.map((l: NavLink) => l.id)) + 1;
        navLinks.push({ ...link, id: newId } as NavLink);
    }
    
    await db.collection(COLLECTION).doc(DOC_ID).update({ navLinks });
}

export async function deleteNavLink(id: number) {
    if (!db) return;
    const config = await getSiteConfig();
    const navLinks = config.navLinks.filter((l: NavLink) => l.id !== id);
    await db.collection(COLLECTION).doc(DOC_ID).update({ navLinks });
}

export async function saveSocialLink(link: Omit<AppSocialLink, 'id' | 'order'> & {id?: number}) {
    if (!db) return;
    const config = await getSiteConfig();
    const socialLinks = [...config.socialLinks];
    
    if (link.id && link.id !== -1) {
        const index = socialLinks.findIndex((l: SocialLink) => l.id === link.id);
        if (index > -1) {
            socialLinks[index] = { ...socialLinks[index], ...link } as SocialLink;
        }
    } else {
        const newId = Math.max(0, ...socialLinks.map((l: SocialLink) => l.id)) + 1;
        socialLinks.push({ ...link, id: newId } as SocialLink);
    }
    
    await db.collection(COLLECTION).doc(DOC_ID).update({ socialLinks });
}

export async function deleteSocialLink(id: number) {
    if (!db) return;
    const config = await getSiteConfig();
    const socialLinks = config.socialLinks.filter((l: SocialLink) => l.id !== id);
    await db.collection(COLLECTION).doc(DOC_ID).update({ socialLinks });
}

export async function saveCryptoDonation(donation: any) {
    if (!db) return;
    const config = await getSiteConfig();
    const cryptoDonations = [...(config.cryptoDonations || [])];
    
    if (donation.id && donation.id !== "-1") {
        const index = cryptoDonations.findIndex((d: any) => d.id === donation.id);
        if (index > -1) {
            cryptoDonations[index] = { ...cryptoDonations[index], ...donation };
        }
    } else {
        const newId = Math.random().toString(36).substring(2, 9);
        cryptoDonations.push({ ...donation, id: newId });
    }
    
    await db.collection(COLLECTION).doc(DOC_ID).update({ cryptoDonations });
}

export async function deleteCryptoDonation(id: string) {
    if (!db) return;
    const config = await getSiteConfig();
    const cryptoDonations = (config.cryptoDonations || []).filter((d: any) => d.id !== id);
    await db.collection(COLLECTION).doc(DOC_ID).update({ cryptoDonations });
}
