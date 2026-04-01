---
trigger: manual
---

# Tailwind CSS Rules

Enforce Tailwind CSS utility-first styling, class conventions, and responsive design patterns

## MUST

- Use Tailwind utility classes in JSX for layout, spacing, typography, colors.
- Encode design tokens (NARTO palette, radii, font sizes) in `tailwind.config` theme `extend`—not scattered magic numbers in JSX when repeated.
- Use `cn()` (e.g. `clsx` + `tailwind-merge`) for conditional class strings on interactive states (focus, selected, hover).
- Respect popup dimensions: avoid `100vw`/`100vh` assumptions; use max-width/height suitable for extension popup.

## MUST NOT

- Use inline `style={{}}` for colors/spacing that belong in theme tokens.
- Create duplicate utility “wrappers” for every div; compose utilities in JSX.

## File structure

- Global entry: `src/index.css` with `@tailwind base/components/utilities` only.
- Optional minimal `src/styles/` for `@layer` additions that cannot be expressed as utilities (rare).

## Naming

- No BEM class names unless required for non-Tailwind CSS; prefer utilities.

## Performance

- Avoid huge arbitrary value strings repeated per item in grids; extract to theme or component constant.
- Do not animate properties that trigger layout (`width`, `height`, `top`) on grid items during navigation; prefer opacity/transform on inner wrapper.

## Pitfalls

- JIT purge: dynamic class string concatenation MUST be avoided (`'bg-' + color`); use a fixed map or data attributes.
- Dark theme is default; do not rely on `dark:` unless the design explicitly uses light mode later.
