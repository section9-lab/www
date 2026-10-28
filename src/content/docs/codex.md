---
title: "Monitor Codex sessions in your Mac’s notch"
description: "Set up a Codex session monitor on macOS. Follow Codex and Claude Code activity, review supported requests, and keep your terminal workflow."
order: 20
updated: "2026-10-28"
---

vibe hud brings Codex session activity into a native Mac notch HUD. Codex remains the agent that performs the work; vibe hud presents its local session state, conversation history, and supported prompts alongside your other connected agents.

<figure>
  <img src="/images/guides/session-preview.webp" alt="Simulated desktop showing Claude Code, Codex, and other agent sessions in the vibe hud notch" width="1200" height="800" loading="lazy" decoding="async" />
  <figcaption>Illustrative walkthrough with sample sessions; it does not show a live connection to your Mac.</figcaption>
</figure>

## Requirements

Use macOS 15.6 or later, install [vibe hud](/download/), and have a working Codex session in your terminal environment. The website’s Codex window is a sample preview, not a connection to a local session.

## Connect Codex

1. Open the vibe hud notch menu.
2. Expand **Agent Hooks** and enable **Codex**.
3. Start a fresh Codex session after enabling the integration.
4. Begin a task in that session and open the notch to follow its progress.

The integration manages vibe hud entries in the Codex hook configuration. Turning the Codex integration off removes those entries for future sessions. An already-running session may retain hooks it loaded earlier, so restart the session when checking a configuration change.

<figure>
  <img src="/images/guides/agent-hooks-preview.webp" alt="Illustration of the vibe hud menu showing Agent Hooks and Accessibility settings" width="1200" height="800" loading="lazy" decoding="async" />
  <figcaption>Simulated menu for orientation. The available settings can change between versions.</figcaption>
</figure>

## Monitor work across agents

Use the notch to see whether a session is processing, waiting for input, or reporting a tool request. Open the conversation view for task history and tool activity. You can keep Codex and Claude Code work in the same HUD while they continue in their own terminal sessions.

vibe hud also includes recovery for recent Codex sessions from local rollout transcripts after the Mac app restarts. Which sessions can be recovered depends on the local transcript files and their state; this is not a cloud history service.

### Example: follow Codex and Claude Code together

Enable both integrations under **Agent Hooks**, then start a fresh session for each agent in its own terminal. Give each one a task and open the notch. The list brings their supported status and history into one view, so you can see which session needs attention without guessing which terminal tab to open.

The agents still execute tasks in their own environments. See the [Claude Code setup and approval guide](/docs/claude-code/) for its separate setup steps.

## Requests and replies

When Codex emits a supported permission event, the HUD can present the tool request for review. Inspect the request before choosing an available action. Reply routing and prompt handling depend on the installed Codex version, emitted events, and terminal environment.

Use the [compatibility guide](/docs/compatibility/) to understand the integration boundaries. An integration appearing in Agent Hooks does not mean every action from every version of an agent is supported.

## Troubleshooting a missing session

- Check that Codex is enabled under Agent Hooks.
- Start a new Codex session after enabling or disabling the integration.
- Make sure the task is running locally in the environment you expect.
- Update vibe hud and Codex, then reproduce the issue with a fresh session.
- If a session appears but a reply or terminal focus action fails, check Accessibility and the route for your terminal in the [compatibility guide](/docs/compatibility/#terminal-and-reply-routing).

For further help, [open a GitHub issue](https://github.com/section9-lab/vibe-hud/issues) with app and agent versions, the terminal you use, and reproducible steps.

Implementation references: [Codex hook configuration](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Hooks/HookInstaller.swift) and [recent-session recovery](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Session/CodexSessionRecovery.swift).
