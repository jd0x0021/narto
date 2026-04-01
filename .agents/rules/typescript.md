---
trigger: manual
---

# TypeScript Rules

Enforce strict TypeScript typing, type safety, and scalable type patterns

## MUST

- Enable and preserve `"strict": true` (no `strictNullChecks: false`, no `any` escape hatches in app code).
- Explicitly type public exports: provider functions, store shape, component `props`.
- Use `satisfies` for config-like objects when narrowing is needed.
- Default to `type`. Only use `interface` when extending object shapes.
- Use `readonly` for immutable props and normalized DTO fields where applicable.
- Narrow unknown errors: `unknown` in `catch`, then type-guard or message extract.

## MUST NOT

- Use `@ts-ignore` / `@ts-expect-error` without a one-line comment and ticket/ref.
- Use non-null assertion (`!`) except when immediately preceded by a guard comment.

## Naming

- Types: `PascalCase` (`NormalizedSearchResult`).
- Type-only imports: `import type { X } from '...'`.
- Constants: `SCREAMING_SNAKE` for true constants (`DEBOUNCE_MS`, `COLUMN_COUNT`).

## File structure

- Shared domain types: `src/services/providers/types.ts` or `src/types/`.
- Avoid barrel files (`index.ts` re-exports) until the repo grows; prefer direct imports for tree-shaking clarity.

## Patterns (follow)

```ts
export type NormalizedSearchResult = Readonly<{
  id: string;
  type: "meme" | "gif";
  displayUrl: string;
  originalUrl: string;
  blurPreview: string;
}>;
```

## Patterns (avoid)

```ts
// ❌
const data = (await res.json()) as SomeUiType;
```

## Performance

- Prefer structural typing; avoid huge generic instantiations in hot paths.
- Do not create large typed arrays in render; derive in store or `useMemo`.
