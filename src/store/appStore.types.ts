import type { StateCreator, StoreApi } from 'zustand';

import type { CommandMenuSlice } from '@/store/slices/commandMenuSlice/commandMenuSlice.types';
import type { GridNavigationSlice } from '@/store/slices/gridNavigationSlice/gridNavigationSlice.types';
import type { SearchInputKeyDownSlice } from '@/store/slices/searchInputKeyDownSlice/searchInputKeyDownSlice.types';
import type { SearchSlice } from '@/store/slices/searchSlice/searchSlice.types';

export interface AppState
	extends CommandMenuSlice, GridNavigationSlice, SearchInputKeyDownSlice, SearchSlice {}

export type AppStateCreator<T> = StateCreator<AppState, [], [], T>;

export type AppStoreApi = {
	get: StoreApi<AppState>['getState'];
	set: StoreApi<AppState>['setState'];
};
