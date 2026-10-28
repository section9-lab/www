# vibe hud website

Product website for [vibe hud](https://github.com/section9-lab/vibe-hud), a native macOS notch HUD for AI agent sessions, tool approvals, conversation history, and replies.

Built with Astro, React, Tailwind CSS, source-controlled shadcn/ui Nova buttons, Lucide, Motion, and Zustand. The interactive preview uses sample sessions and does not connect to local agents.

## Development

| Command | Action |
| --- | --- |
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start the development server |
| `pnpm check` | Check TypeScript and Astro content |
| `pnpm lint` | Run ESLint |
| `pnpm exec vitest run` | Run the store tests |
| `pnpm build` | Build the static site in `dist/` |
| `pnpm preview` | Preview the production build |

## Product alignment

The native repository is the source of truth for product behavior and requirements:

- App icon: `VibeHUD/Assets.xcassets/AppIcon.appiconset/`.
- Agent brand assets: `VibeHUD/Assets.xcassets/Agent*.imageset/`; attribution is retained in `public/images/agents/LICENSE.txt`.
- Notch interaction and sizing: `NotchView.swift`, `NotchViewModel.swift`, and `NotchGeometry.swift`.
- Session phases, ordering, and activity rings: `SessionPhase.swift`, `ClaudeInstancesView.swift`, and `AgentActivitySummary.swift`.

Preview data lives in `src/config/demo.ts`, shared session behavior in `src/stores/island.ts`, and the view components in `src/components/demo/`. Replies use React Hook Form and Zod validation. Native system settings are simulated only within the preview.

The MacBook section is a scroll-driven walkthrough: desktop, Claude launch, Codex launch, session monitoring, approval, reply, and completion. `src/config/walkthrough.ts` defines deterministic scene snapshots; `src/hooks/useDemoWalkthrough.ts` drives the sticky preview with Motion. The inner display’s bottom edge pins to the viewport bottom; the walkthrough begins at that boundary. Interacting with the Dock or HUD pauses the walkthrough until scrolling reaches the next scene. The Dock and HUD support keyboard and touch, and reduced-motion preferences disable launch effects. Desktop UI shares one native coordinate space so menu bars, app windows, and the Dock scale together; the original SVG wallpaper is retained.

Purchase pricing and the Twitter, GitHub, and Slack destinations are website configuration in `src/config/site.ts`. Preserve these independently of native app implementation details.
