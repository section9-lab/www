---
title: "Monitor Claude Code sessions in your Mac’s notch"
description: "Set up a Claude Code session monitor on macOS. Follow multiple sessions, review supported permission requests, and reply from your Mac’s notch."
order: 10
updated: "2026-10-28"
---

vibe hud adds a native macOS notch HUD to your Claude Code workflow. Claude Code continues to run in your terminal; the HUD shows its session events, conversation history, tool activity, and requests that need your attention.

<figure>
  <img src="/images/guides/session-preview.webp" alt="Simulated desktop showing Claude Code, Codex, and other agent sessions in the vibe hud notch" width="1200" height="800" loading="lazy" decoding="async" />
  <figcaption>Illustrative walkthrough with sample sessions; it does not show a live connection to your Mac.</figcaption>
</figure>

## Before you start

Install Claude Code and make sure it runs in your terminal. You also need macOS 15.6 or later and the [latest vibe hud release](/download/). For terminal-specific behavior, check the [compatibility guide](/docs/compatibility/).

## Enable the Claude Code integration

1. Launch VibeHUD.app from Applications.
2. Open the notch menu and expand **Agent Hooks**.
3. Enable **Claude**. This installs the vibe hud hook integration in your Claude configuration.
4. Start a new Claude Code session so it loads the updated hooks, then begin a task.
5. Open the notch to find the session and inspect its current state.

Already-enabled hooks are refreshed when vibe hud starts. Installing the Mac app alone does not enable every agent integration.

<figure>
  <img src="/images/guides/agent-hooks-preview.webp" alt="Illustration of the vibe hud menu showing Agent Hooks and Accessibility settings" width="1200" height="800" loading="lazy" decoding="async" />
  <figcaption>Simulated menu for orientation. The available settings can change between versions.</figcaption>
</figure>

## Follow multiple sessions

Each supported session can report running work, waiting input, tool requests, or completion. Agent rings identify the source, and the count tracks active work. Open a session to read conversation history and recent tool events without switching to another terminal window.

The website walkthrough uses sample sessions. To monitor your own tasks, install the Mac app and enable the integration locally.

### Example: monitor two projects

1. Open two terminal windows or tabs and start Claude Code in each project.
2. Give each session a task. Open the notch to see the sessions together and identify which one is running or waiting for you.
3. Select a session to review its recent messages and tool activity. Return to the corresponding terminal when you need its full context.

The HUD observes supported session events; it does not run the coding agent for you. If a session is missing, check the integration and start that session again after enabling hooks.

## Review tool requests

When a connected session emits a supported permission request, open the notch, inspect the command or tool input, and choose **Allow** or **Deny**. A prompt that asks you to answer a question can be opened in the conversation view.

Review the displayed command or tool input before choosing an action; use the terminal if the request is not available in the HUD. The integration does not turn every terminal interaction into a HUD approval. Available actions depend on the events emitted by your Claude Code version and the running session.

## Reply from the notch

Open the session’s conversation, enter your next instruction, and send it. vibe hud routes the reply through the environment it detects. Depending on your setup, this can use a bridge, tmux, a terminal-specific route, or an Accessibility fallback.

If a reply cannot reach the expected terminal, check the active terminal and session, review the app’s Accessibility status, and try a new session. Terminal focusing may also depend on optional window-management tools in your setup.

## If the session does not appear

- Confirm that **Claude** is enabled under Agent Hooks.
- Start a fresh session after enabling hooks.
- Check the Claude configuration directory selected in vibe hud. The app supports `CLAUDE_CONFIG_DIR`, the selected directory, and the supported default Claude directories.
- Update vibe hud and Claude Code, then try again.
- If the session appears but replies do not arrive, check Accessibility access and the terminal route described in [terminal compatibility](/docs/compatibility/#terminal-and-reply-routing).

For further help, use [installation help](/recover/) or [report an issue](https://github.com/section9-lab/vibe-hud/issues) with your macOS, vibe hud, Claude Code, and terminal versions. Remove conversation text and other private information from any logs you share.

Implementation references: [hook installation](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Hooks/HookInstaller.swift) and [the native project README](https://github.com/section9-lab/vibe-hud#readme).
