export const siteConfig = {
  siteUrl: 'https://section9lab.cn',
  siteName: 'Dyno',
  defaultTitle: 'Dyno for Mac | Dynamic Island for macOS',
  defaultDescription:
    'Dyno brings Dynamic Island to your Mac with live activities, media controls, notifications, widgets, and fluid native animations.',
  defaultSocialImagePath: '/images/icon.png',
  purchaseUrl: 'https://bud.dyno.app/b/aEUaF94fr7D9dK8144',
  downloadUrl: '/download',
  releaseUrl: 'https://releases.bud.dyno.app/latest/Dyno.dmg',
  supportEmail: 'hello@bud.dyno.app',
  priceLabel: '$14.99',
  socialLinks: [
    {
      href: 'https://x.com/tachiko73951901',
      label: 'X (Twitter)',
      icon: 'x',
    },
    {
      href: 'https://github.com/section9-lab/dyno',
      label: 'GitHub',
      icon: 'github',
    },
    {
      href: 'https://discord.bud.dyno.app',
      label: 'Discord',
      icon: 'discord',
    },
  ] as const,
} as const
