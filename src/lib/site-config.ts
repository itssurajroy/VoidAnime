import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';
import type { SiteConfig as AppSiteConfig, NavLink as AppNavLink, SocialLink as AppSocialLink, NavLink, SocialLink } from '@/types/site';
import type { NavLink as DbNavLink } from '@/types/db';

const supabaseAdmin = _supabaseAdmin!;

export type SiteConfig = AppSiteConfig;

const COLLECTION = 'site_config';
const DOC_ID = 'default';

const DEFAULT_CONFIG: SiteConfig = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'VoidAnime',
  tagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || 'Watch Anime Online in HD',
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
    if (!supabaseAdmin) return DEFAULT_CONFIG;
    try {
        const { data, error } = await supabaseAdmin
            .from(COLLECTION)
            .select('*')
            .eq('id', DOC_ID)
            .maybeSingle();

        if (error) {
            console.error('Error fetching site config:', error);
            return DEFAULT_CONFIG;
        }

        if (!data) {
            await supabaseAdmin
                .from(COLLECTION)
                .upsert({ id: DOC_ID, ...DEFAULT_CONFIG });
            return hydrateConfig(DEFAULT_CONFIG);
        }
        return hydrateConfig(data);
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
    if (!supabaseAdmin) return;
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, ...newConfig });
    if (error) console.error('Error updating config:', error);
}

export async function updateTheme(theme: Partial<SiteConfig['theme']>) {
    if (!supabaseAdmin) return;
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, theme });
    if (error) console.error('Error updating theme:', error);
}

export async function updateAnnouncement(announcement: Partial<SiteConfig['announcement']>) {
    if (!supabaseAdmin) return;
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, announcement });
    if (error) console.error('Error updating announcement:', error);
}

export async function updateShareStats(stats: Partial<NonNullable<SiteConfig['shareStats']>>) {
    if (!supabaseAdmin) return;
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, shareStats: stats });
    if (error) console.error('Error updating share stats:', error);
}

export async function saveNavLink(link: Omit<AppNavLink, 'id' | 'order'> & {id?: number}) {
    if (!supabaseAdmin) return;
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
    
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, navLinks });
    if (error) console.error('Error saving nav link:', error);
}

export async function deleteNavLink(id: number) {
    if (!supabaseAdmin) return;
    const config = await getSiteConfig();
    const navLinks = config.navLinks.filter((l: NavLink) => l.id !== id);
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, navLinks });
    if (error) console.error('Error deleting nav link:', error);
}

export async function saveSocialLink(link: Omit<AppSocialLink, 'id' | 'order'> & {id?: number}) {
    if (!supabaseAdmin) return;
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
    
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, socialLinks });
    if (error) console.error('Error saving social link:', error);
}

export async function deleteSocialLink(id: number) {
    if (!supabaseAdmin) return;
    const config = await getSiteConfig();
    const socialLinks = config.socialLinks.filter((l: SocialLink) => l.id !== id);
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, socialLinks });
    if (error) console.error('Error deleting social link:', error);
}

export async function saveCryptoDonation(donation: any) {
    if (!supabaseAdmin) return;
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
    
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, cryptoDonations });
    if (error) console.error('Error saving crypto donation:', error);
}

export async function deleteCryptoDonation(id: string) {
    if (!supabaseAdmin) return;
    const config = await getSiteConfig();
    const cryptoDonations = (config.cryptoDonations || []).filter((d: any) => d.id !== id);
    const { error } = await supabaseAdmin
        .from(COLLECTION)
        .upsert({ id: DOC_ID, cryptoDonations });
    if (error) console.error('Error deleting crypto donation:', error);
}
