import type { SearchProviderError } from '@/services/providers/searchProvider.errors';
import type {
	AppCommandType,
	NormalizedSearchResult,
} from '@/services/providers/searchProvider.types';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
type GridNavigation = 'up' | 'down' | 'left' | 'right';

export type SearchSlice = {
	rawInput: string;
	resolvedCommand: AppCommandType;
	query: string;
	results: NormalizedSearchResult[];
	selectedIndex: number | null;
	status: SearchStatus;
	error?: SearchProviderError;
	requestId: number;

	setInput: (rawInput: string) => void;
	runSearch: () => Promise<void>;
	// This is the currently selected GridImage in the MasonryGrid. It can be null if no GridImage is selected.
	setSelectedIndex: (index: number | null) => void;
	moveSelection: (direction: GridNavigation, columns: number) => void;
};
