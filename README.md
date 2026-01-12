# opencode-caffeinate

An OpenCode plugin that runs `caffeinate -i` while OpenCode is busy, keeping macOS awake during active sessions.

## Requirements

- macOS (uses the built-in `caffeinate` command)
- OpenCode

## Install

Add the plugin to your `opencode.json`:

```json
{
	"$schema": "https://opencode.ai/config.json",
	"plugin": ["@shun-shobon/opencode-caffeinate"]
}
```

OpenCode installs npm plugins automatically on startup using Bun.

## Behavior

- Starts `caffeinate` when a session becomes busy or retrying.
- Stops `caffeinate` when the session becomes idle.
