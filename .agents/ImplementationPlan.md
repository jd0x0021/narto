---
name: narto-chrome-extension
overview: "Implement the NARTO Chrome extension popup: a keyboard-first, command-aware meme and GIF search UI backed by the live Klipy API, matching the provided dark premium reference design pixel-perfectly."
todos:
  - id: inc-01-scaffold-vite-react-ts
    content: Scaffold Vite + React + TypeScript (strict) + minimal App/main entry; verify dev server runs.
    status: pending
  - id: inc-02-tailwind-entry
    content: Add Tailwind/PostCSS, src/index.css, tailwind.config with NARTO theme tokens (colors, radii).
    status: pending
  - id: inc-03-manifest-popup-dist
    content: Add manifest.json (MV3), popup HTML entry, Vite base './' + build output layout; copy manifest to dist if needed.
    status: pending
  - id: inc-04-env-example
    content: Add .env.example (VITE_KLIPY_*) and document loading in klipy client later.
    status: pending
  - id: inc-05-layout-shell
    content: Add PopupLayout, Header (NARTO + v1.0), Footer (keyboard legend); compose in App.
    status: pending
  - id: inc-06-store-input-parse
    content: Add useSearchStore with rawInput + setInput; synchronous command parse → resolvedCommand + query (no fetch yet).
    status: pending
  - id: inc-07-searchinput-controlled
    content: SearchInput controlled by store, autofocus, Esc → window.close; placeholder + helper text only.
    status: pending
  - id: inc-08-provider-client-types
    content: providers/types.ts + klipyClient + getOrCreateCustomerId (chrome.storage.local narto:customer_id).
    status: pending
  - id: inc-09-provider-meme-gif
    content: memeSearchProvider + gifSearchProvider; normalize only → NormalizedSearchResult[] (no raw in store).
    status: pending
  - id: inc-10-debounce-store-search
    content: Add utils/debounce.ts; store debounced runSearch + requestId stale guard; wire onChange (Enter must not fetch).
    status: pending
  - id: inc-11-searchinput-polish
    content: Pixel SearchInput states (focus ring, chip for valid /meme|/gif, powered-by row); still no grid logic.
    status: pending
  - id: inc-12-image-gallery-masonry-layout
    content: ImageGallery + MasonryGrid (3 cols, absolute + transform, ResizeObserver/rAF); GridImage shell + fixed tile sizing.
    status: pending
  - id: inc-13-gridimage-blur-display
    content: GridImage blurPreview + displayUrl load + fade; hover/selected borders; React.memo.
    status: pending
  - id: inc-14-keyboard-navigation
    content: utils/keyboard (optional) + store moveSelection; MasonryGrid arrow rules + wrap + Tab order.
    status: pending
  - id: inc-15-focus-handoff
    content: Top row ArrowUp → focus SearchInput; input ArrowDown → first grid item when results exist.
    status: pending
  - id: inc-16-clipboard-enter
    content: utils/clipboard.ts; Enter on focused tile copies HD asset (PROJECT_CONTEXT); URL fallback; popup stays open.
    status: pending
  - id: inc-17-drag-drop
    content: GridImage draggable; dragstart sets Files/URI/text from HD asset without preloading GIF blobs for grid.
    status: pending
  - id: inc-18-qa-polish
    content: Error/status UX without spinners; manual QA vs reference assets (commands, debounce, Esc, copy, drag).
    status: pending
isProject: false
---

## Goals

- **Build a Manifest V3 Chrome extension** whose popup hosts the NARTO React app.
- **Reproduce the provided UI states pixel-identically** (dark, premium, Naruto-inspired palette without explicit branding) using React + TypeScript + Vite + TailwindCSS.
- **Implement command-aware, debounced search** against the live Klipy API via provider services, normalizing data into internal models stored only in Zustand.
- **Deliver a 3-column masonry grid with keyboard navigation, copy, and drag-and-drop**, following all performance and UX constraints (no spinners, no layout shifts, non-blocking behavior).

## Incremental implementation steps (safe order)

Each step targets **a small set of files**, preserves **providers → store → UI** boundaries from `PROJECT_CONTEXT.md` (repo root), and stays easy to review. Complete in order; do not skip requestId / normalization rules once search exists.

| Step | Todo id                               | Touch (typical)                                                                                | Outcome                                              |
| ---- | ------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 1    | `inc-01-scaffold-vite-react-ts`       | `package.json`, `vite.config.`\*, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx` | Runnable React popup shell                           |
| 2    | `inc-02-tailwind-entry`               | `tailwind.config.`_, `postcss.config.`_, `src/index.css`                                       | Tailwind + theme tokens                              |
| 3    | `inc-03-manifest-popup-dist`          | `manifest.json`, Vite config, popup HTML                                                       | Load unpacked extension from `dist`                  |
| 4    | `inc-04-env-example`                  | `.env.example`                                                                                 | Documented env vars                                  |
| 5    | `inc-05-layout-shell`                 | `PopupLayout`, `Header`, `Footer`, `App`                                                       | Static chrome matches layout regions                 |
| 6    | `inc-06-store-input-parse`            | `useSearchStore.ts`, `parseCommand` helper (e.g. `src/utils/parseCommand.ts`)                  | Store holds `rawInput`, `resolvedCommand`, `query`   |
| 7    | `inc-07-searchinput-controlled`       | `SearchInput.tsx`                                                                              | Controlled input, autofocus, Esc closes              |
| 8    | `inc-08-debounce-store-search`        | `debounce.ts`, `useSearchStore.ts`                                                             | Debounced search + `requestId`; Enter does not fetch |
| 9    | `inc-09-provider-client-types`        | `providers/types.ts`, `klipyClient.ts`, small `customerId` helper                              | Typed client + stable `customer_id`                  |
| 10   | `inc-10-provider-meme-gif`            | `memeSearchProvider.ts`, `gifSearchProvider.ts`                                                | Live Klipy → normalized arrays only                  |
| 11   | `inc-11-searchinput-polish`           | `SearchInput.tsx`, Tailwind tokens                                                             | Pixel states: chip, powered-by, focus                |
| 12   | `inc-12-image-gallery-masonry-layout` | `ImageGallery.tsx`, `MasonryGrid.tsx`, `GridImage.tsx` (layout)                                | 3-col absolute masonry + empty state                 |
| 13   | `inc-13-gridimage-blur-display`       | `GridImage.tsx`                                                                                | Blur → display, no layout shift                      |
| 14   | `inc-14-keyboard-navigation`          | `MasonryGrid.tsx`, `useSearchStore.ts`, optional `keyboard.ts`                                 | Arrows + wrap + Tab order                            |
| 15   | `inc-15-focus-handoff`                | `SearchInput.tsx`, `MasonryGrid.tsx` or parent                                                 | Input ↔ grid focus contract                          |
| 16   | `inc-16-clipboard-enter`              | `clipboard.ts`, `GridImage.tsx`                                                                | Enter copies per `PROJECT_CONTEXT.md`                |
| 17   | `inc-17-drag-drop`                    | `GridImage.tsx`                                                                                | Drag HD asset on demand                              |
| 18   | `inc-18-qa-polish`                    | store/UI as needed                                                                             | No spinners; manual QA checklist                     |

**Deferred until base works:** pixel-perfect micro-tweaks, extra error UI, and perf tuning—after steps 12–16 behave correctly.

**Copy behavior:** Implement clipboard per `PROJECT_CONTEXT.md` (HD PNG/GIF + URL fallback). The “GIF = URL only” bullets in the **GridImage** section below are **deprecated**—follow `PROJECT_CONTEXT.md`.

## Project & Build Setup

- **Scaffold Vite React TS app** inside the existing workspace directory (e.g., `narto/` root) with:
  - `index.html` and `src/main.tsx` bootstrapping `App`.
  - TailwindCSS set up via `tailwind.config.cjs`, `postcss.config.cjs`, and `src/index.css`.
  - TypeScript `strict: true` configured in `tsconfig.json`.
- **Chrome extension structure**:
  - Add `manifest.json` (v3) at project root with:
    - `action.default_popup` pointing to `popup/index.html` (built by Vite).
    - Needed permissions: minimal (`storage` for settings / UUID, `clipboardWrite` if necessary, `activeTab` not required since UI is isolated).
    - Icons placeholders (can be generic for now).
  - Configure Vite to build the React app into a `dist/popup` folder suitable for `default_popup`.
- **Env configuration**:
  - Add `.env.example` with:
    - `VITE_KLIPY_API_KEY=`
    - `VITE_KLIPY_BASE_URL=https://api.klipy.com`
  - Access via `import.meta.env.VITE_KLIPY_API_KEY` etc.

## Directory Structure

- **Core folders**:
  - `src/components/`
    - `SearchInput.tsx`
    - `ImageGallery.tsx`
    - `MasonryGrid.tsx`
    - `GridImage.tsx`
    - `Header.tsx`
    - `Footer.tsx`
    - `PopupLayout.tsx` (composes header, main, footer).
  - `src/services/providers/`
    - `klipyClient.ts` (low-level HTTP client: base URL, key, shared params).
    - `memeSearchProvider.ts` (static memes search abstraction).
    - `gifSearchProvider.ts` (GIF search abstraction).
    - `types.ts` (API response types, internal `NormalizedSearchResult`).
  - `src/store/`
    - `useSearchStore.ts` (Zustand store for search state and actions).
  - `src/utils/`
    - `debounce.ts`
    - `clipboard.ts`
    - `keyboard.ts` (keycode helpers, focus movement helpers if needed).
    - `masonry.ts` (optional helpers for laying out items in three columns while keeping DOM order).
  - `src/styles/`
    - Global Tailwind + custom CSS tokens for the dark theme.

## Styling & Layout (Pixel-identical UI)

- **Theme & typography**:
  - Define Tailwind custom colors (Naruto-inspired oranges, dark grays) and font sizing to match reference screenshots.
  - Set global `body` background, font, and smoothing to match the modal look inside the popup.
- **Header** (`Header.tsx`):
  - Render `NARTO` (replacing `ORNGE`) and `v1.0` using flexbox with appropriate spacing.
  - Include the small circular status indicator dot as per reference.
- **Main layout** (`PopupLayout.tsx` + `ImageGallery.tsx`):
  - Use a constrained fixed-size container (matching screenshot aspect ratio) with rounded corners.
  - Top of main: `SearchInput` spanning full width.
  - Below: `ImageGallery` that renders:
    - No-results state (only input, example text, empty background) when no data.
    - Results state with `MasonryGrid` of images.
- **Footer** (`Footer.tsx`):
  - Layout keyboard instructions horizontally: `↑ ↓ ← → NAVIGATE`, `Enter SELECT`, `Esc CLOSE` matching font sizes and letter/word spacing.
  - Style keycaps as small rounded rectangles.
- **Stateful visual variants**:
  - Implement Tailwind / class-based styles to exactly match these UI states:
    - Initial UI state (search placeholder, powered-by badge visible, no results grid).
    - Unfocused input state (dimmed text and border, overall lowered opacity as in reference).
    - Search without keyword (input filled with query, but no command highlighting, no results yet if fetching or empty).
    - Search with command (e.g., `/meme coding reaction`) showing orange command chip and un-highlighted query.
    - Search with results (grid visible, first item subtly emphasized when focused via keyboard).
    - Hovered image and selected image frames (orange border and subtle elevation/glow to match images).

## Command Parsing & Debounced Search

- **Command parsing utility** (in `SearchInput.tsx` or separate helper):
  - Parse raw input synchronously on every change.
  - Determine `resolvedCommand` and `query` using rules:
    - No leading `/` → treat as `/meme`.
    - `/meme` or `/gif` followed by text → respective command.
    - Partial or invalid commands (`/m something`, `/ something`, `/xyz`) → resolve internally to `/meme` while preserving the raw text in the input.
  - Return: `{ rawInput, resolvedCommand: 'meme' | 'gif', query: string }`.
- **Debounce behavior**:
  - Implement `debounce(fn, delay)` utility that:
    - Cancels previous timer and previous in-flight request token (collaboration with store action) when called repeatedly.
    - Uses 150–200ms delay (configurable constant) before firing actual fetch.
  - `SearchInput` wires `onChange` to:
    - Immediately update `searchQuery` and `resolvedCommand` in Zustand without debounce.
    - Invoke debounced `triggerSearch` only when `query.length >= 1` and `resolvedCommand` exists.
- **Enter key behavior**:
  - On `Enter` in the input, **do not fire search** and leave focus in input.

## Provider Services & Normalization

- **Klipy client** (`klipyClient.ts`):
  - Export `createKlipyClient(apiKey: string, baseUrl: string)` returning functions for GET requests with common params.
  - Attach required query params: `page=1`, `per_page=24`, `customer_id=<stable uuid>`, `locale=<browser locale>`, `content_filter=low`, plus `q`.
  - Generate `customer_id` once per installation and persist in `chrome.storage.local`; reuse it on subsequent sessions.
- **Search providers**:
  - `searchStaticMemes(query: string): Promise<NormalizedSearchResult[]>` using `/api/v1/API_KEY/static-memes/search`.
  - `searchGifs(query: string): Promise<NormalizedSearchResult[]>` using `/api/v1/API_KEY/gifs/search`.
- **Normalization** (in `types.ts` / helpers):
  - Define `NormalizedSearchResult` type per spec.
  - For memes:
    - `displayUrl` → `file.md.png.url`.
    - `originalUrl` & copy/drag source → `file.hd.png.url`.
  - For GIFs:
    - `displayUrl` → `file.md.gif.url` (or fallback to mp4/webp for display if needed, but prioritize GIF per spec).
    - `originalUrl` & copy/drag source → `file.hd.gif.url`.
  - `blurPreview` → `blur_preview`.
  - Use `width`/`height` from chosen size variant.
  - Map `type` to `'meme' | 'gif'`.
  - Ensure raw API responses are not stored in state; only normalized arrays are kept.

## Zustand Store Design

- `**useSearchStore` shape\*\*:
  - State:
    - `rawInput: string`
    - `resolvedCommand: 'meme' | 'gif'`
    - `query: string`
    - `results: NormalizedSearchResult[]`
    - `selectedIndex: number | null`
    - `status: 'idle' | 'loading' | 'success' | 'error'`
    - `errorMessage?: string`
    - `currentRequestId?: string` (for cancelation/tracking)
  - Actions:
    - `setInput(rawInput)` → parses and updates `resolvedCommand` + `query`.
    - `search()` → uses providers based on `resolvedCommand` and `query`, sets `status`, assigns `results`, resets `selectedIndex`, manages `currentRequestId` so out-of-date responses are ignored.
    - `setSelectedIndex(index)`.
    - `moveSelection(direction)` for keyboard navigation at grid level.
  - Implement search cancellation by tagging each search with an incrementing `requestId` and ignoring any response whose ID is not the latest (no need for AbortController in fetch unless desired).

## SearchInput Component

- Layout and behavior:
  - Use a single `input` styled exactly like reference (rounded, orange border, background, placeholder text, powered-by badge at right).
  - On mount, auto-focus the input (using `useEffect` with `ref.focus()`).
  - Render visual variants:
    - Placeholder vs filled text.
    - Unfocused state dims border and text.
    - When `resolvedCommand` is recognized, visually render `[command]` as an orange chip on the left and plain query text to its right.
  - Events:
    - `onChange`: updates store `rawInput` and triggers debounced search via store action when query conditions met.
    - `onKeyDown`:
      - `ArrowDown`: move focus into grid item #1 if results exist.
      - `Escape`: close popup via Chrome extension API (`window.close()`).

## ImageGallery & MasonryGrid

- **ImageGallery**:
  - Reads `results` and `selectedIndex` from store.
  - If no results and no ongoing search, show example text and blank background (initial / empty state screens).
  - If results exist, render `MasonryGrid` with normalized results.
- **MasonryGrid**:
  - Accepts `results.map => GridImage` as children.
  - Accepts `columnCount` and `gap` as props.
  - DOM structure: flat list of items in result order (1..N) to preserve tab order.
  - Layout: Use a **manual masonry layout algorithm with absolute positioning**:
    - The container is `position: relative`.
    - Each child element is positioned with `position: absolute`.
    - The layout algorithm calculates the `(x, y)` coordinates for each item based on column width and accumulated column heights.
    - Column Width Calculation
      - Determine container width using `container.clientWidth`.
      - Compute column width: `columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount`
    - Column Placement Algorithm
      - Maintain an array `columnHeights[columnCount]` initialized to `0`.
      - Iterate through all children in DOM order.
      - Determine the column using modulo: `column = index % columnCount`
    - Compute child position
      - `x = column * (columnWidth + gap)`
      - `y = columnHeights[column]`
    - Apply transform positioning: `child.style.transform` = `translate(${x}px, ${y}px)`
    - Update column height: `columnHeights[column] += child.offsetHeight + gap`
    - After layout completes, set the container height to the maximum column height: `container.style.height = Math.max(...columnHeights)`
    - Layout recalculation occurs when:
      - `children` change
      - `columnCount` or `gap` change
      - container size changes (via `ResizeObserver`)
      - window resize events
    - Resize Handling
      - Use `ResizeObserver` on the container to detect width changes.
      - Use `requestAnimationFrame(layout)` to avoid layout thrashing.
      - Also listen to `window.resize` as a fallback.
    - DOM Order
      - The DOM order is preserved.
      - Items are assigned to columns sequentially (`index % columnCount`), ensuring predictable layout and accessibility.
  - Keyboard handling:
    - On container `onKeyDown`, intercept arrow keys and call store `moveSelection` with knowledge of 3-column grid.
    - Implement rules:
      - Right/Left move horizontally.
      - Up/Down move by ±3 indices; when going past end of a column, wrap to next column correctly.
      - If `selectedIndex` at last item and move further, wrap to 0.
      - If `selectedIndex` in top row and `ArrowUp`, move focus back to input (call a callback from parent or use context/ref).

## GridImage Component

- **Rendering**:
  - Show `blurPreview` as background (e.g., `img` or `div` with `background-image` and blur filter) immediately when item mounts.
  - Start loading `displayUrl` in an off-DOM `Image` (or use `onLoad` events) and, when loaded, fade it in over the blur while keeping dimensions fixed to avoid layout shift.
- **States**:
  - Visual styles for normal, hover, focused, selected (selected when `index === selectedIndex`):
    - Selected: orange border thickness as per reference, subtle shadow.
    - Hover: lighter outline, not as strong as selected.
- **Interactions**:
  - **Focus**: clicking or arrow-navigation focuses the underlying `div` and updates `selectedIndex`.
  - **Keyboard**: `Enter` on focused item calls clipboard copy.
  - **Copy behavior**:
    - Detect the image type from `originalUrl`.
    - If the image is a **GIF**:
      - Copy the **URL only** using: `await navigator.clipboard.writeText(originalUrl)`
    - If the image is a **static image** (`png`, `jpg`, `jpeg`, `webp`, etc):
      - Fetch the image as a Blob.
      - Copy the **actual image data** to the clipboard using `ClipboardItem`.
    - Add a **graceful fallback**:
      - If `navigator.clipboard.write` is not supported, fall back to copying the URL.
    - Put this logic inside `clipboard.ts` so that all copy behavior is centralized.
    - Keep popup open after copy; do not change selection.
  - **Drag & drop**:
    - Mark images draggable.
    - On `dragstart`, fetch the best-quality image (as Blob/File) and set `dataTransfer` with appropriate `Files` / `text/uri-list` / `text/plain` so Slack, Discord, etc., can accept the drop.

## Utilities

- `debounce.ts`:
  - Generic reusable function `debounce<T extends (...args: any[]) => void>(fn: T, delay: number)` returning a debounced wrapper with `cancel` method.
- `clipboard.ts`:
  - Functions:
    - `copyImageFromUrl(url: string, mimeType: string): Promise<void>`.
    - Internally handles Blob fetching and `navigator.clipboard` API.
- `keyboard.ts` (optional helper):
  - Map keyboard events to movement directions.
  - Compute new selection index given current index, total items, and 3-column rules.
- `masonry.ts` (optional):
  - Helper functions for calculating top offsets for each item while preserving DOM order and using fixed column count.

## Chrome Extension Behavior

- **Popup bootstrapping**:
  - When popup HTML loads, mount React `App` into root.
  - `App` renders `PopupLayout` with `Header`, `SearchInput`, `ImageGallery`, and `Footer`.
  - Ensure `SearchInput` `autoFocus` on first render.
- **Closing on Esc**:
  - Global key handler at app/root level listens for `Escape` and calls `window.close()` so the popup closes like a standard extension.
- **Performance considerations**:
  - Keep initial bundle small: no heavy libraries beyond React, Zustand, Tailwind.
  - Use React.memo where beneficial (`GridImage` items).
  - Avoid preloading GIF blobs; only fetch actual assets when copying or dragging, and use display-sized URLs for grid preview.
  - Ensure no layout shifts by fixing container sizes and using intrinsic aspect ratios.
  - Use request ID cancelation pattern so outdated searches never flash outdated results.

## Testing & Validation

- **Visual QA**:
  - Manually compare popup UI against provided reference images for all states (initial, unfocused, command vs no-command, search results, hovered, selected).
- **Behavioral QA**:
  - Verify command parsing and fallback behavior for all examples (plain text, partial `/m`, invalid commands).
  - Confirm debounce timing and that Enter never triggers fetch.
  - Test keyboard navigation (arrows, wrapping, moving back to input, Tab focus order).
  - Test copy and drag into at least one chat app (e.g., Slack or Discord) in a Chrome profile.
  - **Confirm popup closes on Esc and that state initializes quickly (<100ms perceived render** time).
