import type { KeyboardEvent } from 'react';

import type { AppCommandType } from '@/services/providers/searchProvider.types';

export type CommandMenuSlice = {
	selectedCommandIndex: number;
	setSelectedCommandIndex: (index: number) => void;
	chooseCommand: (command: AppCommandType) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
	handleSearchInputKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
	handleCommandMenuKeyDown: (e: KeyboardEvent<HTMLElement>, index?: number) => void;
};
