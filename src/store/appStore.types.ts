import type { StateCreator } from 'zustand';

import type { CommandMenuSlice } from '@/store/slices/commandMenuSlice/commandMenuSlice.types';
import type { NavigationSlice } from '@/store/slices/navigationSlice/navigationSlice.types';
import type { SearchSlice } from '@/store/slices/searchSlice/searchSlice.types';

export type AppState = CommandMenuSlice & NavigationSlice & SearchSlice;
export type AppStateCreator<T> = StateCreator<AppState, [], [], T>;
