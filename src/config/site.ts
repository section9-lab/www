const billingSupportEmail = 'section9lab@gmail.com'

export const siteConfig = {
  siteUrl: 'https://hud.vibevibe.cc',
  siteName: 'vibe hud',
  defaultTitle: 'vibe hud for Mac | AI agents in your notch',
  defaultDescription:
    'Keep Claude, Codex, Cursor, and other AI agent sessions in your Mac’s notch. Follow progress, approve tools, review conversations, and reply without switching windows.',
  defaultKeywords: [
    'VibeHUD',
    'Claude Code notch',
    'Codex session manager',
    'AI agent HUD for Mac',
    'macOS tool approvals',
    'notch app for Mac',
  ],
  defaultSocialImagePath: '/images/icon.png',
  defaultSocialImageAlt: 'The native vibe hud app icon',
  locale: 'en_US',
  language: 'en',
  repositoryUrl: 'https://github.com/section9-lab/vibe-hud',
  purchaseUrl: 'https://bud.dyno.app/b/aEUaF94fr7D9dK8144',
  priceUsd: '14.99',
  priceLabel: '$14.99',
  xHandle: '@tachiko73951901',
  downloadUrl: '/download/',
  releaseUrl: 'https://github.com/section9-lab/vibe-hud/releases/latest',
  supportUrl: 'https://github.com/section9-lab/vibe-hud/issues',
  billingSupportEmail,
  billingSupportUrl: `mailto:${billingSupportEmail}?subject=vibe%20hud%20order%20support`,
  minimumMacOS: '15.6',
  socialLinks: [
    {
      href: 'https://x.com/tachiko73951901',
      label: 'X (Twitter)',
      icon: 'x',
    },
    {
      href: 'https://github.com/section9-lab/vibe-hud',
      label: 'GitHub',
      icon: 'github',
    },
    {
      href: 'https://join.slack.com/t/vibehud/shared_invite/zt-3vb1bzdet-EUoXvfbocahzmcbaOg1aSA',
      label: 'Slack',
      icon: 'slack',
    },
  ] as const,
} as const
