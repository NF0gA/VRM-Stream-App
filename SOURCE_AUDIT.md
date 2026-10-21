# Source Audit

Status: **in progress**. This file distinguishes observations from items that still require verification.

## User-provided XR Animator archive
- Archive referenced in the preparation material: XR Animator_v35.zip.
- The preparation audit reports that it is an Electron distribution/loader package, not a complete development source checkout.
- The described loader references SystemAnimator_path.txt, SystemAnimator_webkit.html, and js/electron_main.js; source provenance and version correspondence need further examination.
- The preparation material reports a CC BY-NC-SA 4.0 notice for XR Animator. Before any reuse, inspect the actual archive's notices and the exact upstream/fork commits. No XR Animator code or bundled assets are intentionally copied into this prototype.

## Candidate references
- XR Animator upstream: https://github.com/ButzYung/SystemAnimatorOnline
- XR Animator refactor: https://github.com/SolveServeSolution/xr-animator
- SysMocap: https://github.com/xianfei/SysMocap
- SnekStudio: https://github.com/ExpiredPopsicle/SnekStudio

These are references for architecture and license review, not permission to copy source. The exact HEAD commit, license file, submodules, bundled assets, and dependency notices must be captured before code reuse is considered. Current review is not sufficient to declare every file or asset license-compatible.

## Independent prototype stack
- Electron: desktop window lifecycle and IPC.
- three.js: rendering.
- @pixiv/three-vrm: VRM loader/runtime.
- Exact resolved package versions and transitive license notices must be recorded from the lockfile after dependency installation.

## Known technical risks
- Electron transparency under Wayland is compositor/session dependent and has not been proven with OBS capture.
- The prototype's model-loading, resize/camera, packaging, and Windows-path behavior require runtime tests.
- No webcam tracking, stabilization, persistent settings, toon preset selection, or performance diagnostics are complete.

## Audit rule
Do not copy code/assets from a reference project until its exact license and provenance are verified. Add third-party notices for any reused material and document attribution/changes as required.
