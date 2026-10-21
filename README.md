# VRM Stream App

OBS向けの軽量なVRMアバター表示デスクトップアプリ。Linux (openSUSE Tumbleweed / KDE Plasma / Wayland) を優先し、WindowsビルドもCIで検証する。

## Status

**Early prototype — not production-ready.** 現段階では設計・技術検証中で、Linux Waylandでの透過表示やOBSキャプチャ、実機でのVRM描画は未確認。

## Planned scope

- 設定ウィンドウと独立したアバター表示ウィンドウ
- VRM 0.x / 1.0 読み込みと軽量描画
- 透過背景 / クロマキー背景、描画FPS上限
- ウィンドウ移動・カメラ操作
- 将来的なWebカメラトラッキングと安定化処理
- Linux / Windows のCIビルド

## Development approach

1. Source and license audit
2. Minimal VRM rendering and OBS/Wayland transparency proof-of-concept
3. Window controls, settings persistence and rendering presets
4. Tracking and stabilization
5. Performance measurements and release workflow

## Development

Requires Node.js 22+ and npm.

```sh
npm install
npm run check
npm start
```

Build commands: `npm run build:linux`, `npm run build:windows`.

No build or runtime result should be assumed successful until verified by CI or a local run. See [SOURCE_AUDIT.md](SOURCE_AUDIT.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).
