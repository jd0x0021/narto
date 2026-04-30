import type { StateCreator } from 'zustand';

import type { CommandMenuSlice } from '@/store/slices/commandMenuSlice/commandMenuSlice.types';
import type { GridNavigationSlice } from '@/store/slices/navigation/gridNavigationSlice/gridNavigationSlice.types';
import type { SearchInputNavigationSlice } from '@/store/slices/navigation/searchInputNavigationSlice/searchInputNavigationSlice.types';
import type { SearchSlice } from '@/store/slices/searchSlice/searchSlice.types';

export type AppState = CommandMenuSlice &
	GridNavigationSlice &
	SearchInputNavigationSlice &
	SearchSlice;

export type AppStateCreator<T> = StateCreator<AppState, [], [], T>;
