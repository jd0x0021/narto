import type { SearchProviderError } from '@/services/providers/searchProvider.errors';
import type {
	AppCommandType,
	NormalizedImageData,
} from '@/services/providers/searchProvider.types';

type SearchStatus = 'Idle' | 'Loading' | 'Success' | 'Error';

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
