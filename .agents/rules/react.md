---
trigger: manual
---

# React Rules

Enforce React best practices for functional components, hooks, and component architecture.

## Scope

- Client-side React only.
- UI runs inside the Chrome extension popup (not injected into web pages).

## MUST

- Use function components + hooks only.
- Define components using function declarations.
- Define the component as a function declaration and export the memoized wrapper (for memoized components).
- Export memoized components directly; do not create an intermediate variable solely for re-exporting.
- Prefer named exports for all components.
- Import components using named imports.
- Colocate one primary component per file; extract subcomponents when responsibilities diverge.
- Use `React.memo` on `GridImage` and list children when props are stable and re-renders are costly.
- Keep event handlers stable: `useCallback` for props passed to memoized children when identity matters.
- Use `useRef` for DOM focus (e.g. `SearchInput` autofocus); avoid `document.querySelector`.

## MUST NOT

- Use class components.
- Use component arrow functions (`const Component = () => {}`).
- Use anonymous components inside `memo()`.
- Use `displayName` for memoized components unless required for debugging.
- Use default exports for components.
- Use `defaultProps` on function components (use default parameters).
- Use `React.StrictMode`-dependent double-effect assumptions for extension popup lifecycle.
- Render loading spinners or skeletons that shift layout (use blur preview + fixed tile sizing).

## React Hooks

- Extract logic into a custom hook when it represents **reusable stateful behavior, side effects, subscriptions, or complex interaction logic**—not merely because a component is getting large.
- When refactoring JSX into a component, **also extract its logic into a custom hook** if that logic is complex, stateful, effect-heavy, or conceptually independent from the UI.
- Keep hooks focused on **one cohesive responsibility** and name them with a `use` prefix that describes the behavior (e.g. `useImageRetry`).
- Do not create a hook solely to wrap trivial calculations or simple event handlers that are clearer inline.
- Prefer hooks for **behavior**, components for **UI**. The component should primarily consume hook state/actions and render the UI.
- Follow React Hooks rules: call hooks only at the top level of React components or custom hooks; never conditionally or inside loops.
- Avoid hooks that unnecessarily mirror props/state or introduce extra effects when derived values or event handlers are sufficient.

## File Structure

- `src/components/<Name>.tsx` — UI + local ephemeral state (`useState`) only.
- `src/main.tsx` — `createRoot`, mount once.
- `src/App.tsx` — compose `PopupLayout`; minimal logic.

## Naming

- Components: `PascalCase.tsx` (`SearchInput.tsx`, `MasonryGrid.tsx`).
- Standard component declarations: `export function ComponentName() {}`.
- Memoized component declarations: `function ComponentNameComponent() {}` + `export const ComponentName = memo(ComponentNameComponent)`.
- Props types: `<ComponentName>Props` (`SearchInputProps`).
- Handlers: `onX` prop / `handleX` local (`onSelect`, `handleKeyDown`).

### Standard Component

```tsx
export function SearchInput(props: SearchInputProps) {
	return <input />;
}
```

### Memoized Component

```tsx
function GridImageComponent(props: GridImageProps) {
	return <img />;
}

export const GridImage = memo(GridImageComponent);
```

### Avoid

```tsx
export const GridImage = memo((props: GridImageProps) => {
	return <img />;
});
```

```tsx
const GridImage = memo(GridImageComponent);
GridImage.displayName = "GridImage";

export { GridImage };
```

## Imports / Exports

### Preferred

```tsx
export function SearchInput(props: SearchInputProps) {
	return <input />;
}
```

```tsx
import { SearchInput } from "@/components/SearchInput";
```

### Avoid

```tsx
export default function SearchInput() {}
```

```tsx
const SearchInput = () => {};
export { SearchInput };
```

```tsx
export const SearchInput = () => {};
```

## Performance

- Avoid inline object/array literals in props to memoized children unless wrapped in `useMemo` or `useCallback`.
- Prefer `key={stableId}` (normalized `id`); never use array index keys for grid items.
