import { supabaseAdmin as _supabaseAdmin } from '@/lib/supabase-admin';

const supabaseAdmin = _supabaseAdmin!;

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://voidanime.online';

export interface SeoSettings {
  metaTitleSuffix: string;
  metaDescription: string;
  googleVerification: string;
  bingVerification: string;
  orgSchema: string;
  robotsTxt: string;
}

const TABLE_NAME = 'settings';
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
  try {
    const { data, error } = await supabaseAdmin
        .from(TABLE_NAME)
        .select('*')
        .eq('id', DOC_ID)
        .maybeSingle();

    if (error) throw error;
    
    if (!data) {
        await supabaseAdmin.from(TABLE_NAME).insert([{ id: DOC_ID, ...DEFAULT_SETTINGS }]);
        return DEFAULT_SETTINGS;
    }
    
    return { ...DEFAULT_SETTINGS, ...data } as SeoSettings;
  } catch (e) {
    console.error('Error fetching SEO settings:', e);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSeoSettings(newSettings: Partial<SeoSettings>) {
    try {
        const { error } = await supabaseAdmin
            .from(TABLE_NAME)
            .upsert({ id: DOC_ID, ...newSettings });
            
        if (error) throw error;
        return { success: true };
    } catch (e) {
        console.error('Error saving SEO settings:', e);
        return { success: false, error: 'Failed to save settings' };
    }
}
