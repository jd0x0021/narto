import type { StateCreator } from 'zustand';

import type { CommandMenuSlice } from '@/store/slices/commandMenuSlice/commandMenuSlice.types';
import type { SearchSlice } from '@/store/slices/searchSlice/searchSlice.types';

export type AppState = SearchSlice & CommandMenuSlice;
export type AppStateCreator<T> = StateCreator<AppState, [], [], T>;
