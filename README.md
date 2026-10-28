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

The MacBook section is a scroll-driven walkthrough: desktop, Terminal running `claude`, Codex launch, session monitoring, approval, reply, and completion. `src/config/walkthrough.ts` defines deterministic scene snapshots; `src/hooks/useDemoWalkthrough.ts` drives the sticky preview with Motion. The inner display’s bottom edge pins to the viewport bottom; the walkthrough begins at that boundary. Interacting with the Dock or HUD pauses the walkthrough until scrolling reaches the next scene. The Dock and HUD support keyboard and touch, and reduced-motion preferences disable launch effects. Desktop UI shares one native coordinate space so menu bars, app windows, and the Dock scale together; the original SVG wallpaper is retained.

Purchase pricing and the Twitter, GitHub, and Slack destinations are website configuration in `src/config/site.ts`. Preserve these independently of native app implementation details.

## Search and content

`src/config/site.ts` is the source of truth for the canonical origin (`https://hud.vibevibe.cc`), purchase price, and product requirements. Astro, metadata, JSON-LD, robots, and the sitemap use that configuration. Pages use trailing slashes consistently. If another domain serves the site, configure its hosting redirect to this origin.

Setup and compatibility guides live in `src/content/docs/`; the content collection generates their pages and sitemap entries. Keep integration claims aligned with the native implementation. FAQ answers are rendered into the initial HTML, and their stable IDs support direct links.

JSON-LD is emitted only through `src/components/seo/JsonLd.astro`, using a serializer that prevents script-closing content from becoming markup. After `pnpm build`, run `pnpm check:seo` to check canonical URLs, metadata, JSON parsing, FAQ content, internal links, and crawler discovery against the actual static output.

The purchase policy is published at `/terms/`; shared policy values live in `src/config/purchase.ts`, with price and private billing contact in `src/config/site.ts`. The offer is a one-time purchase for the buyer’s Macs with a 14-day refund window and minor updates within the purchased major version. Refund requests go to the billing email, not public GitHub issues. This website does not configure checkout-provider terms, process refunds, or add native activation/trial controls. Keep checkout terms aligned when changing this policy.

## Interactive Terminal preview

The Dock opens Terminal, not the Claude desktop app. Run `claude` at the shell prompt to start Claude Code. The terminal and notch share session history, tool approvals, task status, and replies. Supported interactions include Enter to submit, Shift+Enter for multiline input, arrow-key history, Tab completion, interruption with Esc/Ctrl+C, and `/help`, `/files`, `/status`, `/clear`, and `/exit`. Mobile Dock launches open an expanded terminal with readable text and touch controls; drafts are preserved when expanding or collapsing the window.

The preview runs a deterministic task planner and an in-memory filesystem. Try `Read README.md`, `Write notes.txt: Hello`, `Edit notes.txt replace "Hello" with "Hi"`, `!cat notes.txt`, or `Run npm test`. Bash-style commands support common file operations, quotes, output redirection, pipelines, and command chaining. File changes require approval in Claude Code, which can be granted or denied in Terminal or the notch. Unsupported commands return errors. The preview does not run real Bash, call an AI API, or access files on the visitor’s Mac. Its package scripts are simulations that inspect the virtual fixture files, not a JavaScript runtime. Submitting a terminal task switches the preview to manual interaction so scrolling cannot replace the conversation or files with a scripted scene. Files survive closing the terminal; reload the page to reset the workspace and replay the automatic walkthrough.

Behavior references: [Claude Code interactive mode](https://code.claude.com/docs/en/interactive-mode) and [permissions](https://code.claude.com/docs/en/permissions). Workspace fixtures live in `src/config/terminal.ts`, the shell and task planner in `src/lib/demo-shell.ts` and `src/lib/demo-agent.ts`, and the shared terminal slice in `src/stores/terminal.ts`.
