import type { KeyboardEvent } from 'react';

export type GridNavigation = 'up' | 'down' | 'left' | 'right';

export type NavigationSlice = {
	selectedGridIndex: number | null;

	setSelectedGridIndex: (index: number | null) => void;

	// grid related navigations
	moveGridSelection: (direction: GridNavigation, columns: number) => void;

	//search input related navigations
	handleSearchInputKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
};
