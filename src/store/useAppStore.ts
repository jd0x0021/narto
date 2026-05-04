import { create } from 'zustand';

import type { AppState } from '@/store/appStore.types';
import { createCommandMenuSlice } from '@/store/slices/commandMenuSlice/createCommandMenuSlice';
import { createGridNavigationSlice } from '@/store/slices/gridNavigationSlice/createGridNavigationSlice';
import { createSearchInputKeyDownSlice } from '@/store/slices/searchInputKeyDownSlice/createSearchInputKeyDownSlice';
import { createSearchSlice } from '@/store/slices/searchSlice/createSearchSlice';

export const useAppStore = create<AppState>()((...a) => ({
	...createCommandMenuSlice(...a),
	...createGridNavigationSlice(...a),
	...createSearchInputKeyDownSlice(...a),
	...createSearchSlice(...a),
}));
