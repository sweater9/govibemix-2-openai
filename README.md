# GoVibeMix 2

GoVibeMix 2 is an independent, local-first desktop digital audio workstation. Phase 1 establishes a professional timeline workspace, offline project persistence, and a Rust/Tauri audio-engine boundary.

## Development

```bash
npm install
npm run dev
```

To run the desktop shell, install the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) and use `npm run tauri dev`.

## Checks

```bash
npm test
npm run build
npm run check:rust
```

Project data is stored locally through the Tauri backend. Browser development uses local storage as an offline fallback.

