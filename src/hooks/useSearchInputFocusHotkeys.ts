import type { RefObject } from 'react';
import { useEffect } from 'react';

import { useAppStore } from '@/store/useAppStore';

/**
 * Attaches a global keyboard event listener that listens for specific hotkeys
 * and seamlessly transfers focus back to the target inputRef.
 *
 * It prevents the default browser action for the hotkey, removes any active selection
 * from the search store (grid image selection), and focuses the provided input reference.
 *
 * @param inputRef - A React ref object pointing to the target HTMLInputElement.
 */
export function useSearchInputFocusHotkeys(inputRef: RefObject<HTMLInputElement | null>): void {
	const setSelectedGridCell = useAppStore((s) => s.setSelectedGridCell);

	useEffect(() => {
		const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
			const isShortcutKey: boolean =
				e.key === '`' || e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k');

			if (!isShortcutKey) return;

			const isInputFocused: boolean = document.activeElement instanceof HTMLInputElement;

			// do not focus the input if: it's already focused, AND if we did not press ctrl + k
			if (isInputFocused && e.key !== 'k') return;

			// pressing ctrl + k is the only way to focus the input when it's already focused
			e.preventDefault();
			setSelectedGridCell(null);
			inputRef.current?.focus();
		};

		window.addEventListener('keydown', handleGlobalKeyDown);
		return () => {
			window.removeEventListener('keydown', handleGlobalKeyDown);
		};
	}, [inputRef, setSelectedGridCell]);
}
