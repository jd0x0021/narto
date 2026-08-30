import type { SearchStatus } from '@/store/slices/searchSlice/searchSlice.types';
import { useAppStore } from '@/store/useAppStore';

/**
 * Determines the user-friendly display status for the search UI
 * (to be shown at the header), normalizing the raw search status to
 * account for edge cases in the search and image loading lifecycle.
 *
 * @returns The normalized search status suitable for displaying in the UI.
 */
export const useDisplayStatus = (): SearchStatus => {
	const results = useAppStore((s) => s.results);
	const status = useAppStore((s) => s.status);
	const isGridDisplayReady = useAppStore((s) => s.isGridDisplayReady);

	// search was successful, but no results were returned, so we treat this as an "idle" state
	if (status === 'success' && results.length === 0) {
		return 'idle';
	}

	// the app is still in a loading state while grid images are still loading even if the
	// search succeeded, to provide continuous visual feedback during the image loading phase
	if (status === 'success' && !isGridDisplayReady) {
		return 'loading';
	}

	return status;
};
