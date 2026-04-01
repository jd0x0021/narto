---
trigger: manual
---

# Zustand Rules

Enforce Zustand state management patterns, store structure, and usage best practices

## MUST

- Use a single app store module for search domain: `src/store/useSearchStore.ts` (name fixed unless repo convention changes).
- Export a hook `useSearchStore`; use selector form `useSearchStore((s) => s.field)` to minimize re-renders.
- Keep actions on the store (plain functions in `create`)—components call hook-bound actions, not ad-hoc setters everywhere.
- Store ONLY normalized models, never raw Klipy payloads.
- Prevent stale updates via monotonic `requestId`: increment per input-driven search; only the latest request may update `results`/`status`.

## MUST NOT

- Put async fetch + URL construction inside components; store may call providers only.
- Spread entire API responses into state “for later.”

## Naming

- Store file: `useSearchStore.ts`.
- Actions: verb-led `setInput`, `runSearch`, `setSelectedIndex`, `moveSelection`.
- State fields: `rawInput`, `resolvedCommand`, `query`, `results`, `selectedIndex`, `status`, `requestId`.

## File structure

- `src/store/useSearchStore.ts` — one domain store for MVP; split only when a second bounded context appears.

## Patterns (follow)

```ts
const results = useSearchStore((s) => s.results);
const setInput = useSearchStore((s) => s.setInput);
```

```ts
// Inside store action
const next = get().requestId + 1;
set({ requestId: next, status: "loading" });
const data = await searchGifs(q);
if (get().requestId !== next) return;
set({ results: data, status: "success" });
```

## Patterns (avoid)

```ts
// ❌ storing raw
set({ rawKlipy: json });
```

## Performance

- Selectors MUST be narrow; never `useSearchStore()` without selector in hot components.
- Avoid deriving large arrays in selectors on every tick; precompute in actions when possible.

## Pitfalls

- Zustand is sync set; async errors MUST set `status: 'error'` without throwing through render.
- Do not subscribe to the whole store if not needed.
