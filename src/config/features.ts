export const featureItems = [
  { id: 'sessions', titleTop: 'Multi-agent', titleBottom: 'sessions', description: 'See running work, waiting input, and approvals across your agents.' },
  { id: 'approvals', titleTop: 'Inline', titleBottom: 'approvals', description: 'Allow or deny tool requests directly from the notch.' },
  { id: 'history', titleTop: 'Conversation', titleBottom: 'history', description: 'Open a session to review messages, tool calls, and progress.' },
  { id: 'replies', titleTop: 'Quick', titleBottom: 'replies', description: 'Answer prompts and send instructions back to your session.' },
  { id: 'terminals', titleTop: 'Your terminal', titleBottom: 'workflow', description: 'Works with tmux, Terminal, iTerm2, and Ghostty.' },
  { id: 'preferences', titleTop: 'Make it', titleBottom: 'yours', description: 'Choose a display, notification sound, and startup behavior.' },
  { id: 'updates', titleTop: 'Native', titleBottom: 'updates', description: 'Check for and install app updates through Sparkle.' },
  { id: 'hooks', titleTop: 'Agent', titleBottom: 'hooks', description: 'Manage integrations for Claude, Codex, Cursor, and more.' },
] as const

export type FeatureItemId = (typeof featureItems)[number]['id']
