import type { KeyboardEvent } from 'react';

import type { AppCommandType } from '@/services/providers/searchProvider.types';

export type CommandMenuSlice = {
	selectedCommandIndex: number;
	setSelectedCommandIndex: (index: number) => void;
	chooseCommand: (command: AppCommandType) => void;
	handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	handleSearchInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	handleCommandMenuKeyDown: (e: KeyboardEvent<HTMLInputElement>, index?: number) => void;
};
