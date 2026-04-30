import type { KeyboardEvent } from 'react';

export type SearchInputNavigationSlice = {
	handleSearchInputKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
};
