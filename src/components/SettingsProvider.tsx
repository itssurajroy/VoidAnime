'use client';

import { useState, useEffect, ReactNode, createContext, useContext } from 'react';
import { ThemeStyles } from '@/components/shared/ThemeStyles';
import Script from 'next/script';
import type { SiteConfig } from '@/types/site';
import type { SeoSettings } from '@/lib/settings';

interface SiteConfigContextType {
    config: SiteConfig | null;
    seo: SeoSettings | null;
    loading: boolean;
}

const SiteConfigContext = createContext<SiteConfigContextType>({
    config: null,
    seo: null,
    loading: true,
});

export const useSiteConfig = () => useContext(SiteConfigContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [seo, setSeo] = useState<SeoSettings | null>(null);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllSettings() {
      try {
        const configRes = await fetch('/api/site/config', { cache: 'no-store' });
        const data = await configRes.json();
        
        setSeo(data.seo);
        setConfig(data.config);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllSettings();
  }, []);

  const themeConfig = config?.theme;

  const themeStyle = themeConfig ? `
    :root {
      --primary: ${themeConfig.primary};
      --background: ${themeConfig.background};
      --accent: ${themeConfig.accent};
    }
  ` : '';

  return (
    <SiteConfigContext.Provider value={{ config, seo, loading }}>
      {themeConfig && <ThemeStyles css={themeStyle} />}
      {seo?.orgSchema && (
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seo.orgSchema }}
        />
      )}
      {children}
    </SiteConfigContext.Provider>
  );
}
