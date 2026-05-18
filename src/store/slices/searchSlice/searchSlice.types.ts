import type { SearchProviderError } from '@/services/providers/searchProvider.errors';
import type {
	AppCommandType,
	NormalizedImageData,
} from '@/services/providers/searchProvider.types';

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export type SearchSlice = {
	rawInput: string;
	resolvedCommand: AppCommandType;
	query: string;
	results: NormalizedImageData[];
	status: SearchStatus;
	error?: SearchProviderError;
	requestId: number;
	isGridPreviewReady: boolean;

	setInput: (rawInput: string) => void;
	setIsGridPreviewReady: (isGridPreviewReady: boolean) => void;
	runSearch: () => Promise<void>;
};
