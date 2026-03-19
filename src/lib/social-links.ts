export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'Discord',
    url: process.env.NEXT_PUBLIC_SOCIAL_DISCORD || '#',
    icon: 'Send'
  },
  {
    name: 'Telegram',
    url: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM || '#',
    icon: 'Send'
  },
  {
    name: 'Reddit',
    url: process.env.NEXT_PUBLIC_SOCIAL_REDDIT || '#',
    icon: 'Rss'
  },
  {
    name: 'Twitter',
    url: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || '#',
    icon: 'Twitter'
  },
  {
    name: 'Instagram',
    url: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '#',
    icon: 'Instagram'
  },
  {
    name: 'YouTube',
    url: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '#',
    icon: 'Youtube'
  },
].filter(link => link.url && link.url !== '#');
