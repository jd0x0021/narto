---
trigger: manual
---

# Zustand Rules

Enforce Zustand state management patterns, store structure, and usage best practices

## Slice-Based Organization

- **One main store.** Compose all domain slices into a single store; export `useAppStore` from `src/store/useAppStore.ts`. Do not add separate root hooks such as `useSearchStore`, select only from `useAppStore`.
- **Slice factories.** Each slice is implemented as `create[Domain]Slice` (e.g. `createSearchSlice`): a factory that receives Zustand’s `set`, `get`, and store API arguments and returns that slice’s state fields and actions. In `useAppStore.ts`, a single `create` call merges slices with object spread (`{ ...createFooSlice(...args), ... }`). Declare how slices fit together in `src/store/appStore.types.ts`: `AppState` is the intersection of each slice interface; add `AppStateCreator` / `AppStoreApi` when slice code needs typed `get`/`set`.

## MUST

- Export hook `useAppStore`; use selector form `useAppStore((s) => s.field)` to minimize re-renders.
- Keep actions on the store (plain functions in slice creators)—components call hook-bound actions, not ad-hoc setters everywhere.
- Store ONLY normalized models, never raw Klipy payloads.
- Prevent stale updates via monotonic `requestId`: increment per input-driven search; only the latest request may update `results`/`status`.

## MUST NOT

- Put async fetch + URL construction inside components; store may call providers only.
- Spread entire API responses into state “for later.”

## Naming

- **App hook / entry:** `useAppStore` (`src/store/useAppStore.ts`).
- **Per slice:** folder `[domain]Slice`, types file `[domain]Slice.types.ts`, factory `create[Domain]Slice.ts` (PascalCase domain in the factory name matching the slice, e.g. `createSearchSlice`).
- Actions: verb-led `setInput`, `runSearch`, `setSelectedIndex`, `moveSelection`.
- Search-related state fields: `rawInput`, `resolvedCommand`, `query`, `results`, `selectedIndex`, `status`, `requestId`.

## File structure

```
src/store/
	useAppStore.ts              # compose: spread create…Slice(...)
	appStore.types.ts           # AppState = intersection of slice types; creators/helpers
	slices/
		[domain]Slice/
			[domain]Slice.types.ts    # Slice interface (+ internal types)
			create[domain]Slice.ts    # StateCreator wiring for that slice
```

- Optional grouping: mirror the same pattern under a subfolder when slices cluster (e.g. `slices/navigation/searchInputNavigationSlice/` with `searchInputNavigationSlice.types.ts` and `createSearchInputNavigationSlice.ts`).

## Patterns (follow)

```ts
const results = useAppStore((s) => s.results);
const setInput = useAppStore((s) => s.setInput);
```

```ts
// Inside a slice action
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

- Selectors MUST be narrow; never `useAppStore()` without selector in hot components.
- Avoid deriving large arrays in selectors on every tick; precompute in actions when possible.

## Pitfalls

- Zustand is sync set; async errors MUST set `status: 'error'` without throwing through render.
- Do not subscribe to the whole store if not needed.
