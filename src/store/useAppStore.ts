import { create } from 'zustand';

import type { AppState } from '@/store/appStore.types';
import { createCommandMenuSlice } from '@/store/slices/commandMenuSlice/createCommandMenuSlice';
import { createGridNavigationSlice } from '@/store/slices/gridNavigationSlice/createGridNavigationSlice';
import { createSearchInputNavigationSlice } from '@/store/slices/navigation/searchInputNavigationSlice/createSearchInputNavigationSlice';
import { createSearchSlice } from '@/store/slices/searchSlice/createSearchSlice';

export const useAppStore = create<AppState>()((...a) => ({
	...createCommandMenuSlice(...a),
	...createGridNavigationSlice(...a),
	...createSearchInputNavigationSlice(...a),
	...createSearchSlice(...a),
}));
