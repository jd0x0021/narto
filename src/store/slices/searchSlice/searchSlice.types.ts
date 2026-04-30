import type { SearchProviderError } from '@/services/providers/searchProvider.errors';
import type {
	AppCommandType,
	NormalizedSearchResult,
} from '@/services/providers/searchProvider.types';

type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export type SearchSlice = {
	rawInput: string;
	resolvedCommand: AppCommandType;
	query: string;
	results: NormalizedSearchResult[];
	status: SearchStatus;
	error?: SearchProviderError;
	requestId: number;

	setInput: (rawInput: string) => void;
	runSearch: () => Promise<void>;
};
