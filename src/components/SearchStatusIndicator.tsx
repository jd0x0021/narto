import { cva } from 'class-variance-authority';

import { useDisplayStatus } from '@/hooks/useDisplayStatus';
import type { SearchStatus } from '@/store/slices/searchSlice/searchSlice.types';

const statusDotVariants = cva('relative h-2 w-2 rounded-full', {
	variants: {
		status: {
			idle: 'bg-narto-accent',
			loading: 'bg-narto-loading',
			success: 'bg-narto-success',
			error: 'bg-narto-error',
		} as const satisfies Record<SearchStatus, string>,
	},
});

const statusPingVariants = cva('absolute inset-0 rounded-full opacity-50', {
	variants: {
		status: {
			idle: 'animate-ping bg-narto-accent',
			loading: 'animate-ping bg-narto-loading',
			success: 'animate-ping bg-narto-success',
			error: 'animate-ping bg-narto-error',
		} as const satisfies Record<SearchStatus, string>,
	},
});

const statusTextVariants = cva('font-mono leading-none text-xs tracking-wide capitalize', {
	variants: {
		status: {
			idle: 'text-narto-accent',
			loading: 'text-narto-loading',
			success: 'text-narto-success',
			error: 'text-narto-error',
		} as const satisfies Record<SearchStatus, string>,
	},
});

/**
 * Displays the current search status with visual indicators and text.
 *
 * This component renders the search status state from the search slice, showing the current
 * status of a search operation. The status is updated by {@link createSearchSlice} as the
 * search lifecycle progresses through 'idle', 'loading', 'success', or 'error' states.
 *
 * @returns A status indicator component with color-coded styling based on the current search status.
 */
export function SearchStatusIndicator() {
	const displayStatus = useDisplayStatus();

	return (
		<div
			className='flex shrink-0 items-center justify-center self-stretch gap-1.5 
				rounded-narto-full border border-white/[0.04] bg-narto-pill px-3'
			role='status'
			aria-live='polite'
		>
			<span className='relative flex h-2 w-2 shrink-0 items-center justify-center'>
				<span className={statusPingVariants({ status: displayStatus })} aria-hidden />
				<span className={statusDotVariants({ status: displayStatus })} aria-hidden />
			</span>

			<span className={statusTextVariants({ status: displayStatus })}>{displayStatus}</span>
		</div>
	);
}
