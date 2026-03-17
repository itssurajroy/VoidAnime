export interface NavLink {
  id: number;
  text: string;
  url: string;
  icon?: string;
}

export interface SocialLink {
  id: number;
  name: string;
  url: string;
  icon: string; // Name of lucide-react icon
}

export interface ShareStats {
  facebook: string;
  twitter: string;
  telegram: string;
  whatsapp: string;
  total: string;
}

export interface CryptoDonation {
  id: string;
  name: string; // e.g. Bitcoin, Ethereum
  symbol: string; // e.g. BTC, ETH
  address: string;
  qrCodeUrl?: string;
  network?: string; // e.g. ERC20, BEP20
}

export interface SiteConfig {
  siteName: string;
  tagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  theme: {
    primary: string;
    background: string;
    accent: string;
  };
  announcement: {
    enabled: boolean;
    message?: string;
  };
  shareStats?: ShareStats;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  cryptoDonations?: CryptoDonation[];
  header: {
    navLinks: NavLink[];
  };
  footer: {
    navLinks: NavLink[];
    socialLinks: SocialLink[];
  };
}
