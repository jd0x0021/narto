import { create } from 'zustand';
import { parseCommand, type CommandType } from '../utils/parseCommand';
import { searchStaticMemes } from '../services/providers/memeSearchProvider';
import { searchGifs } from '../services/providers/gifSearchProvider';

export interface NormalizedSearchResult {
  id: string;
  type: CommandType;
  width: number;
  height: number;
  previewUrl: string;
  displayUrl: string;
  originalUrl: string;
  blurPreview: string;
  format: 'png' | 'webp' | 'gif' | 'mp4';
}

interface SearchState {
  rawInput: string;
  resolvedCommand: CommandType;
  query: string;
  results: NormalizedSearchResult[];
  selectedIndex: number | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
  requestId: number;

  setInput: (rawInput: string) => void;
  runSearch: () => Promise<void>;
  setSelectedIndex: (index: number | null) => void;
  moveSelection: (direction: 'up' | 'down' | 'left' | 'right', columns: number) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  rawInput: '',
  resolvedCommand: 'meme',
  query: '',
  results: [],
  selectedIndex: null,
  status: 'idle',
  requestId: 0,

  setInput: (rawInput: string) => {
    const parsed = parseCommand(rawInput);
    set({
      rawInput: parsed.rawInput,
      resolvedCommand: parsed.resolvedCommand,
      query: parsed.query,
    });
  },

  runSearch: async () => {
    const { query, resolvedCommand, requestId } = get();

    if (!query) {
      set({ results: [], status: 'idle', selectedIndex: null });
      return;
    }

    const nextId = requestId + 1;
    set({ requestId: nextId, status: 'loading', selectedIndex: null });

    try {
      const data = resolvedCommand === 'meme'
        ? await searchStaticMemes(query)
        : await searchGifs(query);

      if (get().requestId !== nextId) return;

      set({ results: data, status: 'success' });
    } catch (err: unknown) {
      if (get().requestId !== nextId) return;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      set({ status: 'error', errorMessage, results: [] });
    }
  },

  setSelectedIndex: (index) => set({ selectedIndex: index }),

  moveSelection: (direction, columns) => {
    const { results, selectedIndex } = get();
    if (results.length === 0) return;

    if (selectedIndex === null) {
      set({ selectedIndex: 0 });
      return;
    }

    let nextIndex = selectedIndex;
    const count = results.length;

    if (direction === 'right') {
      nextIndex = selectedIndex + 1;
      if (nextIndex >= count) nextIndex = 0;
    } else if (direction === 'left') {
      nextIndex = selectedIndex - 1;
      if (nextIndex < 0) nextIndex = count - 1;
    } else if (direction === 'down') {
      nextIndex = selectedIndex + columns;
      if (nextIndex >= count) {
        // wrap to top of next column if reached end of column visually
        // but row-major order: index 0,1,2 / 3,4,5. 
        // Example: down from 5 (if 7 items), could be 5+3=8 >= 7. Next index should be next column?
        // Wait, "wrap to next column correctly". 
        nextIndex = (selectedIndex % columns) + 1;
        if (nextIndex >= columns) nextIndex = 0;
      }
    } else if (direction === 'up') {
      nextIndex = selectedIndex - columns;
      if (nextIndex < 0) {
        // parent component unsets selected index
        return;
      }
    }

    if (nextIndex >= 0 && nextIndex < count) {
      set({ selectedIndex: nextIndex });
    }
  }
}));
