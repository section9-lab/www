# Search and launch plan

This is an internal working document for the website and native repository. The proposed search phrases below are hypotheses, not measured search-volume or ranking claims. Check Search Console and keyword research data before deciding which additional pages to create.

## Research notes — 2026-10-28

- Search results for Claude Code, Codex, and Mac notch monitoring include dedicated guides and product pages, including [NotchMind's coding-agent guide](https://notchmind.com/docs/coding-agents/) and the [Agent Notch repository](https://github.com/Forichok/Agent-Notch). This supports testing the vocabulary, but does not establish demand, difficulty, or a likely ranking for any phrase.
- The native [hook installer](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Hooks/HookInstaller.swift) refreshes already-enabled hooks on launch and installs agent integrations when selected. The previous native README's claim of unconditional first-launch Claude installation was inconsistent with that implementation.
- Local source includes an initial HTML homepage, setup and compatibility guides, sitemap, canonical URLs, and app structured data. The production site returned the former Dynamic Island homepage on the audit date; deployment and indexing must be checked separately from the local build.
- [Google's title-link guidance](https://developers.google.com/search/docs/appearance/title-link) favors concise, descriptive titles. [Google's AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) describes the same foundational requirements as Search, rather than promising that special AI markup guarantees inclusion. [Search Console's generative AI reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) can show pages and impressions in those features.
- No Search Console property, keyword-volume dataset, live conversion report, verified product review data, or real native-app video was available for this audit. Do not turn the candidate phrases or the simulated visual assets into claims about rankings, search volume, testimonials, or real recorded product behavior.

## Positioning and search intent

vibe hud is a native macOS notch HUD for local AI coding sessions. Claude Code and Codex continue to run in their own environments; vibe hud displays supported session events, history, requests, and replies. The actions available depend on the agent and terminal. Product analytics are disclosed on the privacy page.

| Intent | Candidate phrases | Page | Next validation |
| --- | --- | --- | --- |
| Discover the product | `claude code codex notch mac`, `ai coding agent monitor mac` | `/` | Check impressions, queries and click-through rate after release |
| Set up Claude | `claude code notch`, `monitor multiple claude code sessions`, `claude code permission requests mac` | `/docs/claude-code/` | Look for real queries about session status and permissions |
| Set up Codex | `codex session monitor mac`, `codex notch mac` | `/docs/codex/` | Compare query impressions with the Claude guide |
| Check a setup | `claude code ghostty`, `codex tmux monitor` | `/docs/compatibility/` | Add examples only when verified against the relevant environment |
| Navigate by name | `vibe hud`, `vibehud mac` | `/` and native GitHub README | Monitor branded clicks and make the product name consistent |

Avoid creating multiple pages that merely swap agent names. Expand a guide when a distinct user need and verified details justify it. Do not claim support for every approval, terminal, agent version, or AI feature.

## Release gate

The production domain was serving the previous site when audited on 2026-10-28; the new `/pricing/` and `/docs/claude-code/` routes returned 404. Before sharing the new guides, deploy the current `www` branch and verify the homepage, `/download/`, `/docs/`, both agent guides, `/pricing/`, `/privacy/`, `/robots.txt`, and `/sitemap.xml` from outside the development environment. Check the live page title and the guides' content, not just HTTP status. Inspect live URLs in Google Search Console and submit the sitemap. A sitemap is a discovery hint, not an indexing guarantee.

## GitHub

The native repository README is updated locally alongside this website change. Once the website routes are live, commit and publish the README from the separate `vibe-hud` repository. Check the repository description, homepage link, and relevant topics against the README and product behavior. The demo GIF is a simulated desktop with sample sessions and must remain labeled as such. Never describe it as a live capture.

## Community launch drafts

Do not post automatically. Follow each community's rules, disclose that you built the product, and invite feedback without promising unsupported behavior.

### Developer community

Title: `I built a Mac notch HUD to keep track of Claude Code and Codex sessions`

Body:

> I work with multiple coding-agent sessions and wanted a quicker way to see which one is running or waiting for me. I built vibe hud, a native macOS app that brings supported session activity into the Mac's notch.
>
> Claude Code and Codex still run in their own environments. The HUD can show session history and supported tool requests; available approvals and reply routes depend on the agent and terminal. The website demo uses simulated sessions.
>
> I'm the developer, and I'd appreciate feedback on the setup experience, especially with Terminal.app, iTerm2, Ghostty, and tmux. Source: https://github.com/section9-lab/vibe-hud · Website: https://hud.vibevibe.cc/

### Short product announcement

> I made vibe hud for following Claude Code, Codex, and other coding-agent sessions from the Mac notch. See what's running or waiting, review supported requests, and open session history without hunting through terminal windows. The website preview uses sample sessions. https://hud.vibevibe.cc/

## Product video shot list

Record the actual native app and clearly identify any simulated content. Use disposable sample projects; remove personal paths, API keys, private prompts, and notifications before recording.

1. Start Claude Code in a terminal and show the session appearing in the notch.
2. Start a separate Codex session and show both sessions in the list.
3. Show a real supported tool request and its context; choose an action only if it is actually available for that session.
4. Open history and demonstrate a reply using a verified terminal route.
5. End with the product name, macOS requirement, website, and a short note that behavior varies by agent and terminal.

Suggested title: `Monitor Claude Code and Codex Sessions in Your Mac's Notch`. Add captions and a written description. Do not substitute the simulated website walkthrough for native-app footage without labeling it.

## Measurement

Before changes are released, record Search Console's last 28- and 90-day clicks, impressions, CTR, query/page/country/device breakdown, and indexing status. Review every two weeks after release and compare equivalent periods while noting low-volume volatility. Identify meaningful queries where pages receive impressions but few clicks, then improve the matching title, excerpt, or page content. Use the dedicated generative AI report when available.

GA4 records website visits and queues three custom click events: `download_page_click` (entry to the download page), `download_release_click` (release link), and `purchase_link_click` (checkout link). Their `link_location` parameter is the page path. Verify them in GA4 Realtime or DebugView after deployment; events can be missing when analytics is blocked. These clicks are not installs or completed purchases. Treat checkout-confirmed purchases as a separate conversion only when an accurate integration is available. Do not invent keyword volume, rankings, impressions, testimonials, reviews, or conversion figures.
