# PROJECT CONTEXT

## Product Overview
NARTO is a keyboard-first meme and GIF discovery tool delivered as a Chrome Extension popup. It provides a premium, command-palette style interface for rapidly searching, previewing, and inserting memes/GIFs sourced from the Klipy API. The UI is optimized for instant keyboard navigation and non-blocking behavior: no spinners, minimal layout shifts, and responsive input-driven updates.

## Target User
- Power users who live in chat tools (Slack, Discord, Messenger, etc.) and want a fast way to insert memes/GIFs without leaving the keyboard.
- Teams and developers who expect polished, command-palette-like UX in modern SaaS products.

## Core Features (MVP)
- Chrome Extension popup UI that auto-focuses the search input on open.
- Command-aware search supporting **only**:
  - `/meme`
  - `/gif`
- Forgiving, synchronous command resolution:
  - Inputs without a valid command resolve internally to `/meme`
  - Invalid/partial commands are not visually “corrected”; only recognized commands are highlighted
- Debounced automatic search requests (150–200ms) triggered only by input changes.
- Klipy-powered search with provider services + response normalization into an internal model.
- Three-column masonry grid (always exactly 3 columns) using absolute positioning to preserve DOM order and keyboard/tab behavior.
  - Exactly **3** columns; container `position: relative`; children **absolutely** positioned.
- Keyboard navigation:
  - Arrow keys move selection within the grid (with wrapping rules)
  - `↑` from top row returns focus to the search input
  - `Enter` on a focused grid item selects/copies the highest-quality available asset while keeping the popup open
  - `Esc` closes the popup (standard extension dismissal behavior)
- Blur-preview loading:
  - Render blur preview immediately
  - Load display image afterward and replace without layout shift
- Copy and drag-and-drop behavior:
  - Copy highest-quality available image for selection
  - Drag highest-quality available image so drop targets like Messenger/Slack/Discord accept it

## Tech Stack
- Chrome Extension: Manifest V3 popup (no content script overlay injection)
- React (CS-rendered in popup)
- TypeScript with `strict: true`
- Vite
- TailwindCSS (Tailwind-first). Minimal custom CSS is allowed only when required for pixel-perfect fidelity.
- Zustand for global state (and the only global state solution)
- Klipy API accessed through replaceable provider services

## Architecture Overview
High-level responsibilities:

- **UI (components)**
  - Own rendering, styling, focus management, and keyboard event wiring.
  - Must not perform API calls or implement Klipy endpoint logic.
- **State (Zustand store)**
  - Own the search input state (`rawInput`, `resolvedCommand`, `query`), normalized results, selection index, and fetch status.
  - Store only normalized/internal models (never raw API payloads).
- **Services (providers)**
  - Own all Klipy network logic behind typed provider interfaces.
  - Normalize raw responses into `NormalizedSearchResult[]`.
  - Klipy is replaceable: other providers should be swappable behind the same interface.
- **Utilities**
  - Own cross-cutting behaviors like debouncing, clipboard copying, and masonry positioning helpers.

Strict rule (important):
- No provider logic in `components/`, `hooks/`, or `stores/`.
  - Components can dispatch store actions.
  - Store actions can call providers.
  - Providers contain HTTP requests + normalization.

## Folder Structure
Expected main directories (align with implementation plan):

- `src/components/`
  - `Header.tsx`: static header (`NARTO`, status indicator, version)
  - `SearchInput.tsx`: command-aware input, debounced trigger wiring, command highlighting visuals, keyboard focus behavior
  - `ImageGallery.tsx`: chooses between empty state and `MasonryGrid` based on normalized results/state
  - `MasonryGrid.tsx`: 3-column absolute-positioned masonry layout + arrow-key navigation logic
  - `GridImage.tsx`: one result tile (blur preview, display image load, hover/focus/selected visuals, copy on Enter, drag support)
  - `Footer.tsx`: keyboard instruction row (arrows, `Enter`, `Esc`)
  - `PopupLayout.tsx`: composes header/main/footer
- `src/services/providers/`
  - `klipyClient.ts`: HTTP client, base URL, API key handling, shared request params
  - `memeSearchProvider.ts`: static meme search provider
  - `gifSearchProvider.ts`: GIF search provider
  - `types.ts`: Klipy response types + internal `NormalizedSearchResult` type
- `src/store/`
  - `useSearchStore.ts`: Zustand store for search state/actions
- `src/utils/`
  - `debounce.ts`: reusable debounce helper (with `cancel`)
  - `clipboard.ts`: clipboard copy utilities (image/URL fallback behavior centralized)
  - `keyboard.ts`: arrow-key movement helpers for grid navigation (optional)
  - `masonry.ts`: absolute-position coordinate helpers (optional)
- `src/styles/`
  - theme tokens + Tailwind entry styles for the dark premium UI
- Root
  - `manifest.json`: Chrome MV3 configuration for popup
  - `index.html` + Vite config
  - `.env` / `.env.example`: `VITE_KLIPY_API_KEY`, `VITE_KLIPY_BASE_URL`
  - `PROJECT_CONTEXT.md`

## UI Design System
- **Visual theme**
  - Dark-mode premium SaaS modal style.
  - Color inspiration is Naruto Shippuden–like (orange accents, deep darks) but the UI must not reference Naruto branding (no logo usage beyond the text requirement).
- **Branding**
  - Header shows `NARTO` (replace the reference `ORNGE` with `NARTO`).
- **Layout structure**
  - Header
  - Main (SearchInput + ImageGallery)
  - Footer
- **Pixel and behavior constraints**
  - Pixel-identical reproduction of the provided UI reference states is a primary requirement.
  - No spinners and no layout shifts.
  - Blur preview must appear immediately, then swap to the display image without changing tile dimensions.
- **Masonry Grid Rules**
  - Exactly **3 columns** always.
  - Use absolute positioning within a `position: relative` container.
  - Preserve DOM order for correct Tab navigation (row-major: `1 2 3 / 4 5 6 / 7 8 9`).
- **Footer legend**
  - Render keyboard hints horizontally: `↑ ↓ ← → : Navigate`, `Enter : Select`, `Esc : Close`.
  - Keycaps styled as small rounded rectangles per reference.

## Command System Contract
Inputs must be parsed synchronously and never throw or block.

- **Supported commands**
  - `/meme`
  - `/gif`
- **Parsing format**
  - Input format: `/command query`
- **Forgiving resolution rules (internal)**
  - If user types `coding reaction` (no leading `/`), resolve internally as `/meme coding reaction`.
  - If user types `/gif happy cat`, resolve internally as GIF search with query `happy cat`.
  - If user types `/meme cat`, resolve internally as static meme search with query `cat`.
  - If user types `/m something`, resolve internally as `/meme something`.
  - If user types `/ something` or `/xyz something` or any invalid command, resolve internally to `/meme` (but see UI rule below).
- **UI highlighting rule**
  - Only valid commands should be highlighted visually.
  - Invalid commands must not be visually corrected.
  - The query text must never be highlighted.
- **Store outputs**
  - Parser returns:
    - `rawInput` (exact user input)
    - `resolvedCommand: 'meme' | 'gif'` (internal resolution)
    - `query` (string used for searching)

## Provider & Klipy Contract
Providers own all network calls and normalization.

- **Klipy base URL**
  - `VITE_KLIPY_BASE_URL` (default: `https://api.klipy.com` per plan)
- **Endpoints**
  - Static memes: `/api/v1/API_KEY/static-memes/search`
  - GIFs: `/api/v1/API_KEY/gifs/search`
- **Required query parameters**
  - `page=1`
  - `per_page=24`
  - `q=<query>`
  - `customer_id=<stable uuid>`
  - `locale=<browser locale>`
  - `content_filter=low`
- **Stable customer_id**
  - Generate once per installation and persist to `chrome.storage.local`.
  - Reuse across sessions.

## Normalization Mapping Contract
Normalized objects must be used everywhere in UI/store.

`NormalizedSearchResult` shape (conceptual, align with plan/spec):
- `id: string`
- `type: 'meme' | 'gif'`
- `width: number`
- `height: number`
- `previewUrl: string` (preview for blur background)
- `displayUrl: string` (grid display)
- `originalUrl: string` (highest-quality for copy + drag)
- `blurPreview: string`
- `format: 'png' | 'webp' | 'gif' | 'mp4'` (whatever the chosen variant implies)

Mapping rules:
- **Static memes**
  - Grid display image: `file.md.png.url` (md.png)
  - Copy/drag source: `file.hd.png.url`
  - Placeholder: `blur_preview`
- **GIFs**
  - Grid display image: prefer `file.md.gif.url` (md.gif)
  - Copy/drag source: `file.hd.gif.url`
  - Placeholder: `blur_preview`
- Raw API payloads must never be stored in Zustand or passed to components.

## Keyboard Navigation Contract
- **Tab order**
  - Follows DOM order, which is row-major because masonry uses absolute positioning while preserving element order.
- **Arrow navigation**
  - Grid is 3 columns; treat indices accordingly.
  - Horizontal:
    - `→` moves to next item
    - `←` moves to previous item
  - Vertical:
    - `↓` moves to next row
    - `↑` moves to previous row
    - Implement via ±3 index math (3 columns)
  - Column edge rule:
    - If user reaches the end of a column, and they press `↓`, they should move to the first grid item of the next column.
  - Final element rule:
    - If user reaches on the last row and last column and last element, and they press `↓`, they should move to the first grid item of the first column.
- **Input focus handoff**
  - If focus is on any grid item on the top row and the user presses `↑`, focus moves into the search input.
  - If input is focused and the user presses `↓`, focus moves into grid item `#1`.

## Clipboard & Drag Contract
- **Enter selection copy**
  - When a grid tile is focused, `Enter` copies the highest-quality available asset.
  - Keep popup open after copy.
  - Selection unchanged.
- **Copy choice**
  - Prefer copying actual image data (PNG for memes, GIF for GIFs) when clipboard image writing is supported.
  - If clipboard image writing is not supported, fallback to copying the asset URL.
  - Centralize this in `src/utils/clipboard.ts`.
- **Drag**
  - Draggable tiles must provide data for chat targets to accept drops.
  - Use the highest-quality URL for drag.
  - Drag should be non-blocking for UI rendering; asset fetching for drag happens only when the drag starts.

## Data Flow
1. `SearchInput.tsx`
   - On each input change:
     - parse synchronously into `{ rawInput, resolvedCommand, query }`
     - update Zustand immediately
     - trigger debounced search only if:
       - `resolvedCommand` exists
       - `query.length >= 1`
2. Zustand store (`useSearchStore.ts`)
   - Owns request cancellation/ignoring:
     - assign an incrementing `requestId` per search
     - ignore any results that do not match the latest `requestId`
   - Calls provider services and stores only normalized results.
   - `Enter` in the input must never trigger fetch.
3. Providers
   - Perform Klipy API requests and normalize responses into `NormalizedSearchResult[]`.
   - All requests via `src/services/providers/**`
4. UI rendering
   - `ImageGallery` chooses between empty state vs `MasonryGrid`.
   - `MasonryGrid` uses absolute positioning coordinates but does not reorder DOM.
   - `GridImage` renders:
     - blur preview first (`blurPreview`)
     - display image second (`displayUrl`) with no layout shift

## Coding Standards
- **Strict separation**
  - Components do not call Klipy endpoints.
  - Providers contain network and normalization logic.
  - Store actions orchestrate providers but do not embed endpoint details in components.
- **No raw payloads**
  - Raw API responses must never enter Zustand or component props.
- **Non-blocking & performance**
  - No loading spinners.
  - Cancel/ignore stale requests on input changes.
  - Keep initial render fast (<100ms perceived).
- **Keyboard correctness**
  - DOM order must match keyboard/tab order.
  - Arrow-key selection must feel instant and follow the contract exactly.
  - `Esc` should close the popup via `window.close()` or the standard extension dismissal mechanism.
- **Type safety**
  - Use strict TypeScript typing for providers, normalized models, and store actions.
  - Prefer small, testable utilities with clear responsibilities.