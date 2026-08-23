import type { KeyboardEvent, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import type { FileFormatType } from '@/services/providers/searchProvider.types';
import { copyImageFromUrl } from '@/utils/clipboard';

export type CopyImageState = 'idle' | 'copying' | 'copied' | 'error';

/**
 * Manages copy-to-clipboard state and behavior for a grid image.
 *
 * Handles async copy operations with timeout-based state resets and cleanup.
 *
 * @param highResUrl The image URL passed to the clipboard utility.
 * @param format The file format for the copied content.
 * @returns Copy state and an event handler for starting a copy operation.
 */
export function useCopyImageState(highResUrl: string, format: FileFormatType) {
	const [copyState, setCopyState] = useState<CopyImageState>('idle');
	const [copiedAsFile, setCopiedAsFile] = useState(false);

	const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Cleanup timeouts on unmount
	useEffect(() => {
		return () => {
			if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
			if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
		};
	}, []);

	/**
	 * Starts copying the image when an event is triggered.
	 *
	 * @param e The keyboard or pointer event that initiated the copy action.
	 */
	const handleCopyOnEvent = (
		e: KeyboardEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>,
	): void => {
		e.stopPropagation();

		const handleCopy = async (): Promise<void> => {
			try {
				setCopyState('copying');
				setCopiedAsFile(false);
				const copiedFile = await copyImageFromUrl(highResUrl, format);
				setCopyState('copied');
				setCopiedAsFile(copiedFile);

				if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);

				copiedTimeoutRef.current = setTimeout(() => {
					setCopyState('idle');
				}, 2000);
			} catch {
				setCopyState('error');
				setCopiedAsFile(false);

				if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);

				errorTimeoutRef.current = setTimeout(() => {
					setCopyState('idle');
				}, 2000);
			}
		};

		void handleCopy();
	};

	return { copyState, copiedAsFile, handleCopyOnEvent };
}
