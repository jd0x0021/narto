import { useEffect, useRef, useState } from 'react';

const MAX_DISPLAY_RETRIES = 3;
const INITIAL_RETRY_BACKOFF_MS = 1000;

export type DisplayImageLoadState = 'loading' | 'retrying' | 'failed' | 'loaded';

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

export function useImageRetry(initialUrl: string) {
	const [displaySrc, setDisplaySrc] = useState(initialUrl);
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

	const handleDisplayImageError = (): void => {
		if (retryCount >= MAX_DISPLAY_RETRIES) {
			setDisplayImageLoadState('failed');
			return;
		}

		setDisplayImageLoadState('retrying');

		const delay = INITIAL_RETRY_BACKOFF_MS * 2 ** retryCount;
		retryTimeoutRef.current = setTimeout(() => {
			const nextRetryAttempt = retryCount + 1;
			setRetryCount(nextRetryAttempt);
			setDisplaySrc(buildRetryDisplayUrl(initialUrl, nextRetryAttempt));
		}, delay);
	};

	return {
		displaySrc,
		displayImageLoadState,
		setDisplayImageLoadState,
		handleDisplayImageError,
	};
}
