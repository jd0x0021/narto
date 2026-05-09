import type { RefObject } from 'react';
import { useEffect } from 'react';

import { useAppStore } from '@/store/useAppStore';

/** Keys that focus the search input when pressed without modifier keys (Cmd/Ctrl/Meta). */
const SEARCH_FOCUS_PLAIN_KEYS: ReadonlySet<string> = new Set(['`', '/']);

/** Keys that focus the search input when pressed with modifier keys (Ctrl/Cmd/Meta). */
const SEARCH_FOCUS_MODIFIER_KEYS: ReadonlySet<string> = new Set(['k', 'a']);

/**
 * Determines if the given keyboard event is part of a modifier chord.
 * A modifier chord typically involves pressing Ctrl or Command (Cmd) keys along with another key.
 *
 * @param e - The keyboard event to check for a modifier chord.
 * @returns - `true` if the event is part of a modifier chord, false otherwise.
 */
function hasModifierChord(e: KeyboardEvent): boolean {
	return e.ctrlKey || e.metaKey;
}

/**
 * Checks whether the keydown event key matches a search-input focus shortcut.
 *
 * @param e - Keyboard event to evaluate.
 * @returns `true` if the event key should focus the search input.
 */
function isSearchInputFocusShortcut(e: KeyboardEvent): boolean {
	if (SEARCH_FOCUS_PLAIN_KEYS.has(e.key)) {
		return true;
	}

	// e.g. Ctrl/Cmd + K or Ctrl/Cmd + A
	return hasModifierChord(e) && SEARCH_FOCUS_MODIFIER_KEYS.has(e.key);
}

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
			if (!isSearchInputFocusShortcut(e)) return;

			const isInputFocused: boolean =
				inputRef.current != null && inputRef.current === document.activeElement;

			// When the input is already focused, ignore plain shortcuts; only K and A continue (matches prior `e.key` checks).
			if (isInputFocused && !SEARCH_FOCUS_MODIFIER_KEYS.has(e.key)) return;

			e.preventDefault();
			setSelectedGridCell(null);
			inputRef.current?.focus();

			if (e.key === 'a' && inputRef.current) {
				// Select all text in the input if Ctrl/Cmd+A is pressed.
				inputRef.current.select();
			}
		};

		window.addEventListener('keydown', handleGlobalKeyDown);
		return () => {
			window.removeEventListener('keydown', handleGlobalKeyDown);
		};
	}, [inputRef, setSelectedGridCell]);
}
