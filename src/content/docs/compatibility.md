---
title: "Agent and terminal compatibility"
description: "See how vibe hud connects to Claude Code, Codex, Cursor, GitHub Copilot, Pi, OpenCode, WorkBuddy, and Qwen Work, and what affects terminal controls and replies."
order: 30
updated: "2026-10-28"
---

vibe hud requires **macOS 15.6 or later**. It supports several agent integration types, but available actions vary with the agent, emitted session events, and terminal setup. The app is a session HUD, not an AI model provider or a replacement for a coding agent.

## Supported agent integrations

Open the notch menu and expand **Agent Hooks** to enable or disable each integration.

| Agent | Integration in vibe hud | Setup and scope |
| --- | --- | --- |
| Claude Code | Claude session hooks | Enable Claude, then start a new session. Supports the app’s core session, conversation, approval, and reply workflows when the required events and routes are available. |
| Codex | Codex hooks and local rollout history | Enable Codex, then start a fresh session. Session monitoring and recent-session recovery are implemented; request handling depends on the running version and environment. |
| Cursor | Command hooks | Enable Cursor to receive supported session and tool events. |
| GitHub Copilot | Command hooks | Enable GitHub Copilot to receive supported session, tool, and permission events. |
| Pi | Agent extension | Enable Pi to install the vibe hud extension used by the integration. |
| OpenCode | Agent plugin | Enable OpenCode to install its integration plugin. |
| WorkBuddy | Session hooks | Enable WorkBuddy to connect supported session events and local conversation history. |
| Qwen Work | Local session monitoring | Enable Qwen Work to turn on the app’s monitoring integration. |

An agent being listed here does not imply that every tool, prompt, or terminal-control action is available. If you need a specific workflow, test it with the versions you use and include those versions when reporting a problem.

## Terminal and reply routing

The native app includes routes for **Terminal.app**, **iTerm2**, **Ghostty**, and **tmux** workflows. It can also detect other terminal and editor processes, but process detection alone is not a guarantee of full reply or focus support.

Replies may use a bridge, a tmux target, a terminal-specific route, or an Accessibility fallback. The available route depends on the session metadata and your local setup. Some terminal focusing features benefit from optional window-management tools.

## macOS permissions

The notch menu includes an **Accessibility** status entry. If your chosen control or reply route needs Accessibility access, review the app’s request in macOS System Settings. Reading a local session and controlling a terminal are different capabilities, so a visible session does not by itself prove that a reply route is ready.

For setup steps, start with [the installation guide](/docs/). The [Claude Code guide](/docs/claude-code/) and [Codex guide](/docs/codex/) describe their individual workflows.

## Data and version information

Session history is read locally to power the HUD. The Mac app also uses product analytics; see [privacy and data use](/privacy/) for the distinction. Check GitHub Releases or the app’s update control for the latest build rather than relying on a version number in an old tutorial.

This guide is based on the native app’s [session source model](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Models/SessionState.swift), [integration installer](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Hooks/HookInstaller.swift), and [terminal registry](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Shared/TerminalAppRegistry.swift).
