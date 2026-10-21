# Implementation Plan

This repository is an early prototype. Do not treat a successful syntax check as evidence that the application launches, renders VRM files, or works with OBS.

## Phase 0 — Source and licensing audit
- Record the exact source archive/version examined, source availability, and known license notices.
- Review upstream project licenses and dependency licenses before copying any code or assets.
- Keep independent implementation separate from inspiration; do not copy code from projects with incompatible terms.
- Keep third-party notices and unresolved questions in this repository.

## Phase 1 — Rendering and capture proof of concept
- Build a minimal desktop shell with a settings window and independent avatar window.
- Load local VRM 0.x / VRM 1.0 files using a maintained VRM loader.
- Verify model loading and basic materials with test models whose licenses permit testing.
- Highest priority: test transparent-window behavior on KDE Plasma Wayland and OBS window capture. If unsupported, document the limitation and test chroma-key capture as fallback.

## Phase 2 — Window operations and settings
- Add transparent/chroma background, frame toggle, drag-to-move, camera rotate/pan, FPS cap, and persistent settings.
- Verify creation-time window flags are applied consistently after settings changes.
- Handle model load errors and renderer/window lifecycle cleanly.

## Phase 3 — Tracking and stabilization
- Evaluate camera-tracking implementations and their license/runtime constraints before integration.
- Separate tracking inference rate from render FPS.
- Implement confidence-aware smoothing, outlier rejection, brief-loss hold, per-part loss handling, joint limits, and smooth reacquisition.
- Do not promise stable tracking until validated across lighting, occlusion, and camera conditions.

## Phase 4 — Performance evaluation
- Compare the same model/scene and output conditions against the game alone and available reference apps.
- Record average FPS, frametime distribution/stutters, CPU per-core use, RAM, VRAM, GPU use, render FPS and tracking inference rate.
- Record hardware, OS, compositor, display setup, driver, and test procedure.

## Phase 5 — CI and release
- Run syntax checks and Linux/Windows package builds in GitHub Actions.
- Inspect CI artifacts and launch the actual packaged application on target platforms.
- Publish releases only after the acceptance checks below pass.

## Acceptance checklist
- [ ] Application launches on openSUSE Tumbleweed / KDE Plasma Wayland.
- [ ] A permitted sample VRM loads without console errors.
- [ ] Transparent background is captured correctly by OBS, or a documented chroma-key fallback is provided.
- [ ] Settings and avatar windows are independent.
- [ ] Window movement, camera controls, and background/FPS options work.
- [ ] Settings survive application restart.
- [ ] Tracking handles brief loss and reacquisition without severe pose jumps.
- [ ] Linux and Windows builds complete in CI and packaged builds are launch-tested.
- [ ] Performance measurements include reproducible conditions and raw results.
- [ ] Third-party license notices are complete.
