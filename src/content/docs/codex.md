---
title: "Monitor Codex sessions from your Mac’s notch"
description: "Enable the Codex integration in vibe hud, follow session activity and conversation history, and handle supported requests while keeping your terminal workflow."
order: 20
updated: "2026-10-28"
---

vibe hud brings Codex session activity into a native Mac notch HUD. Codex remains the agent that performs the work; vibe hud presents its local session state, conversation history, and supported prompts alongside your other connected agents.

## Requirements

Use macOS 15.6 or later, install [vibe hud](/download/), and have a working Codex session in your terminal environment. The website’s Codex window is a sample preview, not a connection to a local session.

## Connect Codex

1. Open the vibe hud notch menu.
2. Expand **Agent Hooks** and enable **Codex**.
3. Start a fresh Codex session after enabling the integration.
4. Begin a task in that session and open the notch to follow its progress.

The integration manages vibe hud entries in the Codex hook configuration. Turning the Codex integration off removes those entries for future sessions. An already-running session may retain hooks it loaded earlier, so restart the session when checking a configuration change.

## Monitor work across agents

Use the notch to see whether a session is processing, waiting for input, or reporting a tool request. Open the conversation view for task history and tool activity. You can keep Codex and Claude Code work in the same HUD while they continue in their own terminal sessions.

vibe hud also includes recovery for recent Codex sessions from local rollout transcripts after the Mac app restarts. Which sessions can be recovered depends on the local transcript files and their state; this is not a cloud history service.

## Requests and replies

When Codex emits a supported permission event, the HUD can present the tool request for review. Inspect the request before choosing an available action. Reply routing and prompt handling depend on the installed Codex version, emitted events, and terminal environment.

Use the [compatibility guide](/docs/compatibility/) to understand the integration boundaries. An integration appearing in Agent Hooks does not mean every action from every version of an agent is supported.

## Troubleshooting a missing session

- Check that Codex is enabled under Agent Hooks.
- Start a new Codex session after enabling or disabling the integration.
- Make sure the task is running locally in the environment you expect.
- Update vibe hud and Codex, then reproduce the issue with a fresh session.

If the session is visible but a reply or terminal focus action fails, check your terminal setup and the app’s Accessibility status. For further help, [open a GitHub issue](https://github.com/section9-lab/vibe-hud/issues) with app and agent versions, the terminal you use, and reproducible steps.

Implementation references: [Codex hook configuration](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Hooks/HookInstaller.swift) and [recent-session recovery](https://github.com/section9-lab/vibe-hud/blob/main/VibeHUD/Services/Session/CodexSessionRecovery.swift).
