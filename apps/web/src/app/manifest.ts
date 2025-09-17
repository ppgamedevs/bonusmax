import { siteConfig } from '../config/site';

export default function manifest() {
  return {
    name: siteConfig.name,
    short_name: 'Bonusmax',
    description: siteConfig.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0B0B0B',
    theme_color: '#0B0B0B',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  } as const;
}
