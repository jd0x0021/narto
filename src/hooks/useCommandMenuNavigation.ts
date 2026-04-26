import type { KeyboardEvent } from 'react';
import { useState } from 'react';

import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import { useSearchStore } from '@/store/useSearchStore';

const SPACE = ' ' as const;
const keyboardKeys = ['Escape', 'ArrowDown', 'ArrowUp', 'Enter', SPACE] as const;
const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

type KeyboardKey = (typeof keyboardKeys)[number];
type KeyboardKeyEventHandler = Record<KeyboardKey, () => void>;
type UseCommandMenuNavigationProps = {
	showCommandMenu: boolean;
};

const isSupportedKeyboardKey = (key: string): key is KeyboardKey => {
	return keyboardKeys.some((k) => k === key);
};

export function useCommandMenuNavigation({ showCommandMenu }: UseCommandMenuNavigationProps) {
	const setInput = useSearchStore((s) => s.setInput);
	const results = useSearchStore((s) => s.results);
	const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);

	const [selectedCommandIndex, setSelectedCommandIndex] = useState<number>(0);

	const closeCommandMenu = () => {
		setInput('');
	};

	const chooseCommand = (command: string) => {
		const commandValue = `/${command} `;
		setInput(commandValue);
	};

	const handleCommandMenuKeyDown = (e: KeyboardEvent, currentIndex?: number) => {
		if (!isSupportedKeyboardKey(e.key)) return;

		const keyEventHandlers: KeyboardKeyEventHandler = {
			Escape: () => {
				closeCommandMenu();
			},
			ArrowDown: () => {
				setSelectedCommandIndex((current) =>
					current < commandOptions.length - 1 ? current + 1 : 0,
				);
			},
			ArrowUp: () => {
				setSelectedCommandIndex((current) =>
					current > 0 ? current - 1 : commandOptions.length - 1,
				);
			},
			Enter: () => {
				const index = currentIndex ?? selectedCommandIndex;
				chooseCommand(commandOptions[index]);
			},
			[SPACE]: () => {
				const index = currentIndex ?? selectedCommandIndex;
				chooseCommand(commandOptions[index]);
			},
		};

		e.preventDefault();
		keyEventHandlers[e.key]();
	};

	const handleInputKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			window.close();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (results.length > 0) {
				setSelectedIndex(0);
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (results.length > 0) {
				setSelectedIndex(results.length - 1);
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			// Enter never fetches
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (showCommandMenu) {
			handleCommandMenuKeyDown(e);
			return;
		}

		handleInputKeyDown(e);
	};

	return {
		selectedCommandIndex,
		setSelectedCommandIndex,
		handleKeyDown,
		chooseCommand,
	};
}
