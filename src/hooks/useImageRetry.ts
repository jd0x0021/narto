import { useEffect, useRef, useState } from 'react';

import { useAppStore } from '@/store/useAppStore';

const MAX_DISPLAY_RETRIES = 3;
const INITIAL_RETRY_BACKOFF_MS = 1000;

export type DisplayImageLoadState = 'loading' | 'retrying' | 'failed' | 'loaded';

/**
 * Produces a retry-safe image URL by appending cache-busting query parameters.
 *
 * The helper preserves any existing query string and updates the retry counter
 * together with a fresh timestamp so the browser is forced to re-request the
 * image rather than reuse a stale cached response.
 *
 * @param baseUrl - The original image URL to retry.
 * @param retryAttempt - The retry count associated with this attempt.
 * @returns A URL string that is safe to use for the next image load attempt.
 */
function buildRetryDisplayUrl(baseUrl: string, retryAttempt: number): string {
	try {
		const url = new URL(baseUrl);
		url.searchParams.set('retry', String(retryAttempt));
		url.searchParams.set('t', String(Date.now()));
		return url.href;
	} catch {
		const sep = baseUrl.includes('?') ? '&' : '?';
		return `${baseUrl}${sep}retry=${retryAttempt}&t=${Date.now()}`;
	}
}

/**
 * Manages the lifecycle of a display image that may fail to load and require retries.
 *
 * The hook keeps the image source and UI state in sync as the component moves
 * through loading, retrying, and failure states. It is designed to be resilient
 * to transient image failures without forcing the consumer to manage timing or
 * cache-busting concerns directly.
 *
 * @param initialUrl - The initial image URL to render.
 * @returns A stateful controller containing the current image source, load state, and
 * a handler for reacting to image load failures.
 */
export function useImageRetry(imageId: number, initialUrl: string) {
	const markDisplayImageFailed = useAppStore((s) => s.markDisplayImageFailed);

	const [displayImageSrc, setDisplayImageSrc] = useState(initialUrl);
	const [retryCount, setRetryCount] = useState(0);
	const [displayImageLoadState, setDisplayImageLoadState] =
		useState<DisplayImageLoadState>('loading');
	const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		return () => {
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current);
			}
		};
	}, []);

	/**
	 * Advances the image loading flow after a failed render attempt.
	 *
	 * When the retry budget is still available, the hook transitions the UI into a
	 * retrying state and schedules a fresh image request with an exponential backoff.
	 * Once the maximum number of attempts has been exhausted, the hook marks the image
	 * as permanently failed so the caller can present a terminal error state.
	 */
	const handleDisplayImageError = (): void => {
		if (retryCount >= MAX_DISPLAY_RETRIES) {
			setDisplayImageLoadState('failed');
			markDisplayImageFailed(imageId);
			return;
		}

		setDisplayImageLoadState('retrying');

		const delay = INITIAL_RETRY_BACKOFF_MS * 2 ** retryCount;
		retryTimeoutRef.current = setTimeout(() => {
			const nextRetryAttempt = retryCount + 1;
			setRetryCount(nextRetryAttempt);
			setDisplayImageSrc(buildRetryDisplayUrl(initialUrl, nextRetryAttempt));
		}, delay);
	};

	return {
		displayImageSrc,
		displayImageLoadState,
		setDisplayImageLoadState,
		handleDisplayImageError,
	};
}
