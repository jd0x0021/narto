---
trigger: manual
---

# React Rules

Enforce React best practices for functional components, hooks, and component architecture

## Scope

- Client-side React only.
- UI runs inside the Chrome extension popup (not injected into web pages).

## MUST

- Use function components + hooks only.
- Colocate one primary component per file; extract subcomponents when responsibilities diverge.
- Use `React.memo` on `GridImage` and list children when props are stable and re-renders are costly.
- Keep event handlers stable: `useCallback` for props passed to memoized children when identity matters.
- Use `useRef` for DOM focus (e.g. `SearchInput` autofocus); avoid `document.querySelector`.
- Split: presentational components in `src/components/`; no `fetch` or Klipy URLs in components.

## MUST NOT

- Use class components.
- Use `defaultProps` on function components (use default parameters).
- Use `React.StrictMode`-dependent double-effect assumptions for extension popup lifecycle.
- Render loading spinners or skeletons that shift layout (use blur preview + fixed tile sizing).

## File structure

- `src/components/<Name>.tsx` — UI + local ephemeral state (via `useState`) only.
- `src/main.tsx` — `createRoot`, mount once.
- `src/App.tsx` — compose `PopupLayout`; minimal logic.

## Naming

- Components: `PascalCase.tsx` (`SearchInput.tsx`, `MasonryGrid.tsx`).
- Props types: `<ComponentName>Props` (`SearchInputProps`).
- Handlers: `onX` prop / `handleX` local (`onSelect`, `handleKeyDown`).

## Performance

- Avoid inline object/array literals in props to memoized children unless wrapped in `useMemo`/`useCallback`.
- Prefer `key={stableId}` (normalized `id`), never array index for grid items.
