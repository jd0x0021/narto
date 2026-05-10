import type { SearchProviderError } from '@/services/providers/searchProvider.errors';
import type {
	AppCommandType,
	NormalizedImageData,
} from '@/services/providers/searchProvider.types';

export type SearchStatus = 'Idle' | 'Loading' | 'Success' | 'Error';

export const SEARCH_STATUS_HEX_COLORS = {
	Idle: '#ff6b00',
	Loading: '#FDC601',
	Success: '#10B981',
	Error: '#EF4444',
} as const satisfies Record<SearchStatus, string>;

export type SearchSlice = {
	rawInput: string;
	resolvedCommand: AppCommandType;
	query: string;
	results: NormalizedImageData[];
	status: SearchStatus;
	error?: SearchProviderError;
	requestId: number;

	setInput: (rawInput: string) => void;
	runSearch: () => Promise<void>;
};
