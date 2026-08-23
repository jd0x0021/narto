import type { KeyboardEvent, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { FileFormatType } from '@/services/providers/searchProvider.types';
import { copyImageFromUrl } from '@/utils/clipboard';

/**
 * Manages copy-to-clipboard state and behavior for images.
 * Handles async copy operations with timeout-based state resets and cleanup.
 */
export function useCopyImageState(highResUrl: string, format: FileFormatType) {
	const [copying, setCopying] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [copyErrored, setCopyErrored] = useState(false);

	const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
			if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
		};
	}, []);

	const handleCopyOnEvent = (
		e: KeyboardEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>,
	): void => {
		e.stopPropagation();

		const handleCopy = async (): Promise<void> => {
			try {
				setCopying(true);
				await copyImageFromUrl(highResUrl, format);
				setCopying(false);
				setIsCopied(true);

				if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);

				copiedTimeoutRef.current = setTimeout(() => {
					setIsCopied(false);
				}, 2000);
			} catch {
				setCopyErrored(true);
				setCopying(false);

				if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
				errorTimeoutRef.current = setTimeout(() => {
					setCopyErrored(false);
				}, 2000);
			}
		};

		void handleCopy();
	};

	return { copying, isCopied, copyErrored, handleCopyOnEvent };
}
