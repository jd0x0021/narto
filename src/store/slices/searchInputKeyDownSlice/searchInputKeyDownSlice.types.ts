import type { KeyboardEvent } from 'react';

export type SearchInputKeyDownSlice = {
	handleSearchInputKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
};
