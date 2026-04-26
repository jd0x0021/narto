import type { KeyboardEvent } from 'react';
import { useState } from 'react';

import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import { useSearchStore } from '@/store/useSearchStore';

const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

type UseCommandMenuNavigationProps = {
	showCommandMenu: boolean;
};

const SPACE = ' ' as const;

type KeyboardKey = 'Escape' | 'ArrowDown' | 'ArrowUp' | 'Enter' | typeof SPACE;

type KeyboardKeyEventHandler = Record<KeyboardKey, () => void>;

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

		if (e.key in keyEventHandlers) {
			e.preventDefault();
			keyEventHandlers[e.key as KeyboardKey]();
		}
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
