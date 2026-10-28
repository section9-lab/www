---
title: "Claude Code sessions and approvals on Mac"
description: "Connect Claude Code to vibe hud, monitor multiple terminal sessions, and handle supported tool approvals and replies from your Mac’s notch."
order: 10
updated: "2026-10-28"
---

vibe hud adds a native macOS notch HUD to your Claude Code workflow. Claude Code continues to run in your terminal; the HUD shows its session events, conversation history, tool activity, and requests that need your attention.

## Before you start

Install Claude Code and make sure it runs in your terminal. You also need macOS 15.6 or later and the [latest vibe hud release](/download/). For terminal-specific behavior, check the [compatibility guide](/docs/compatibility/).

## Enable the Claude Code integration

1. Launch VibeHUD.app from Applications.
2. Open the notch menu and expand **Agent Hooks**.
3. Enable **Claude**. This installs the vibe hud hook integration in your Claude configuration.
4. Start a new Claude Code session so it loads the updated hooks, then begin a task.
5. Open the notch to find the session and inspect its current state.

Already-enabled hooks are refreshed when vibe hud starts. Installing the Mac app alone does not enable every agent integration.

## Follow multiple sessions

Each supported session can report running work, waiting input, tool requests, or completion. Agent rings identify the source, and the count tracks active work. Open a session to read conversation history and recent tool events without switching to another terminal window.

The website walkthrough uses sample sessions. To monitor your own tasks, install the Mac app and enable the integration locally.

## Review tool requests

When a connected session emits a supported permission request, open the notch, inspect the command or tool input, and choose **Allow** or **Deny**. A prompt that asks you to answer a question can be opened in the conversation view.

The integration does not turn every terminal interaction into a HUD approval. Available actions depend on the events emitted by your Claude Code version and the running session.

## Reply from the notch

Open the session’s conversation, enter your next instruction, and send it. vibe hud routes the reply through the environment it detects. Depending on your setup, this can use a bridge, tmux, a terminal-specific route, or an Accessibility fallback.

If a reply cannot reach the expected terminal, check the active terminal and session, review the app’s Accessibility status, and try a new session. Terminal focusing may also depend on optional window-management tools in your setup.

## If the session does not appear

- Confirm that **Claude** is enabled under Agent Hooks.
- Start a fresh session after enabling hooks.
- Check the Claude configuration directory selected in vibe hud. The app supports `CLAUDE_CONFIG_DIR`, the selected directory, and the supported default Claude directories.
- Update vibe hud and Claude Code, then try again.

For further help, use [installation help](/recover/) or [report an issue](https://github.com/section9-lab/vibe-hud/issues) with your macOS, vibe hud, Claude Code, and terminal versions. Remove conversation text and other private information from any logs you share.

Implementation references: [hook installation](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Hooks/HookInstaller.swift) and [the native project README](https://github.com/section9-lab/vibe-hud#readme).
