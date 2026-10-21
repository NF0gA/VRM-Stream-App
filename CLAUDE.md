# Development Instructions

Work incrementally. Do not attempt the entire application in one pass.

## Required workflow
1. Inspect current source, exact upstream commits, and license notices before reusing code.
2. Keep implementation independent unless reuse has been explicitly reviewed and documented.
3. Prioritize the Linux Wayland transparent-window + OBS capture proof of concept.
4. After each phase, record changed files, commands run, tests that passed/failed/not run, and unresolved issues in the README or a phase log.
5. Never describe a feature as working unless it was actually tested. Distinguish static checks, build checks, and runtime tests.
6. Keep user data and VRM models out of commits unless explicitly requested.

## Target environment
- Primary: openSUSE Tumbleweed, KDE Plasma, Wayland, OBS.
- Secondary: Windows build via GitHub Actions.
- The prototype should remain lightweight; render FPS and camera inference FPS should be independently configurable.

## Architecture goals
- Separate settings UI from the avatar render window.
- Keep Electron IPC narrow and validate all values received from renderer processes.
- Avoid enabling Node integration in renderer windows.
- Persist user settings only after a deliberate schema/defaults decision.
- Use graceful error messages for invalid or unsupported VRM files.

## Current status
The repository is an early prototype. Wayland transparency, OBS capture, VRM runtime compatibility, and package builds are not yet verified.
