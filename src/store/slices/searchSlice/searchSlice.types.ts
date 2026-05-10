import type { SearchProviderError } from '@/services/providers/searchProvider.errors';
import type {
	AppCommandType,
	NormalizedImageData,
} from '@/services/providers/searchProvider.types';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export type SearchSlice = {
	rawInput: string;
	resolvedCommand: AppCommandType;
	query: string;
	results: NormalizedImageData[];
	status: SearchStatus;
	error?: SearchProviderError;
	requestId: number;
	/** False until masonry has run initial width/translate/height for the current visible result set. */
	gridLayoutCalculationCompleted: boolean;

	setInput: (rawInput: string) => void;
	runSearch: () => Promise<void>;
	setGridLayoutCalculationCompleted: (completed: boolean) => void;
};
