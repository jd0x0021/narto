---
trigger: manual
---

# Vite (Extension Popup Build)

Enforce Vite configuration, project structure, and build optimization best practices

## MUST

- Use `import.meta.env.VITE_*` for Klipy key and base URL (initially); never hardcode secrets in source.
- Configure a dedicated popup entry (single `index.html` as popup) and point `manifest.json` `action.default_popup` at built HTML in `dist/`.
- Set `base: './'` so asset paths resolve inside `chrome-extension://` URLs.
- Output a flat or predictable `dist/` layout; extension loads unpacked `dist/`.
- Use `define` sparingly; prefer env vars for configuration.

## MUST NOT

- Reference Node-only APIs (`fs`, `path`) in client bundle code.
- Ship source maps with embedded sources to a public store listing without review (dev OK locally).
- Use `process.env` in app code (Vite uses `import.meta.env`).

## File structure

- `vite.config.ts` at repo root (or `vite.config.mts`).
- `manifest.json` at root; copy to `dist` via plugin or build step.
- Static assets under `public/` if referenced by root path.

## Naming

- Env vars: `VITE_KLIPY_API_KEY`, `VITE_KLIPY_BASE_URL`, `VITE_*`.
- Build scripts in `package.json`: `dev`, `build`, `preview` (names conventional).

## Performance

- Code-split only if it improves popup cold start; popup MUST stay small—avoid heavy deps.
- Pre-bundle rare deps only when measure shows benefit (`optimizeDeps`).
