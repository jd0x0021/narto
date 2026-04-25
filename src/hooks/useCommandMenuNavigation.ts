import type { KeyboardEvent } from 'react';
import { useState } from 'react';

import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import { useSearchStore } from '@/store/useSearchStore';

const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

export function useCommandMenuNavigation() {
	const setInput = useSearchStore((s) => s.setInput);

	const [selectedCommandIndex, setSelectedCommandIndex] = useState<number>(0);

	const closeCommandMenu = () => {
		setInput('');
	};

	const chooseCommand = (command: string) => {
		const commandValue = `/${command} `;
		setInput(commandValue);
	};

	const handleCommandMenuKeyDown = (e: KeyboardEvent, currentIndex?: number) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			closeCommandMenu();
			return;
		}

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setSelectedCommandIndex((current) =>
				current < commandOptions.length - 1 ? current + 1 : 0,
			);
			return;
		}

		if (e.key === 'ArrowUp') {
			e.preventDefault();
			setSelectedCommandIndex((current) =>
				current > 0 ? current - 1 : commandOptions.length - 1,
			);
			return;
		}

		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			const index = currentIndex ?? selectedCommandIndex;
			chooseCommand(commandOptions[index]);
			return;
		}
	};

	return {
		selectedCommandIndex,
		setSelectedCommandIndex,
		handleCommandMenuKeyDown,
		chooseCommand,
	};
}
