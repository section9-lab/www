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
| `pnpm test` | Run unit tests with coverage |
| `pnpm build` | Build the static site in `dist/` |
| `pnpm check:seo` | Verify the production HTML after building |
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

## Search and content

`src/config/site.ts` is the source of truth for the canonical origin (`https://hud.vibevibe.cc`), purchase price, and product requirements. Astro, metadata, JSON-LD, robots, and the sitemap use that configuration. Pages use trailing slashes consistently. If another domain serves the site, configure its hosting redirect to this origin.

Setup and compatibility guides live in `src/content/docs/`; the content collection generates their pages and sitemap entries. Keep integration claims aligned with the native implementation. FAQ answers are rendered into the initial HTML, and their stable IDs support direct links.

JSON-LD is emitted only through `src/components/seo/JsonLd.astro`, using a serializer that prevents script-closing content from becoming markup. After `pnpm build`, run `pnpm check:seo` to check canonical URLs, metadata, JSON parsing, FAQ content, internal links, and crawler discovery against the actual static output. Exact purchase limits, trials, and refunds must come from confirmed checkout terms; do not infer them from repository access.
