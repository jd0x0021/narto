import type { KeyboardEvent } from 'react';
import { useState } from 'react';

import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import { useSearchStore } from '@/store/useSearchStore';

const SPACE = ' ' as const;
const commandKeyboardKeys = ['Escape', 'ArrowDown', 'ArrowUp', 'Enter', SPACE] as const;
const searchInputKeys = ['Escape', 'ArrowDown', 'ArrowUp'] as const;
const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

type CommandKeyboardKey = (typeof commandKeyboardKeys)[number];
type CommandKeyboardKeyEventHandler = Record<CommandKeyboardKey, () => void>;
type SearchInputKey = (typeof searchInputKeys)[number];
type SearchInputKeyEventHandler = Record<SearchInputKey, () => void>;
type UseCommandMenuNavigationProps = {
	showCommandMenu: boolean;
};

const isCommandKeyboardKey = (key: string): key is CommandKeyboardKey => {
	return commandKeyboardKeys.some((k) => k === key);
};

const isSearchInputKeyboardKey = (key: string): key is SearchInputKey => {
	return searchInputKeys.some((k) => k === key);
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
		if (!isCommandKeyboardKey(e.key)) return;

		const keyEventHandlers: CommandKeyboardKeyEventHandler = {
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

	const handleSearchInputKeyDown = (e: KeyboardEvent) => {
		if (!isSearchInputKeyboardKey(e.key)) return;

		const keyEventHandlers: SearchInputKeyEventHandler = {
			Escape: () => {
				window.close();
			},
			ArrowDown: () => {
				if (results.length > 0) {
					setSelectedIndex(0);
				}
			},
			ArrowUp: () => {
				if (results.length > 0) {
					setSelectedIndex(results.length - 1);
				}
			},
		};

		e.preventDefault();
		keyEventHandlers[e.key]();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (showCommandMenu) {
			handleCommandMenuKeyDown(e);
			return;
		}

		handleSearchInputKeyDown(e);
	};

	return {
		selectedCommandIndex,
		setSelectedCommandIndex,
		handleKeyDown,
		chooseCommand,
	};
}
