import { create } from 'zustand';

import type { AppState } from '@/store/appStore.types';
import { createCommandMenuSlice } from '@/store/slices/commandMenuSlice/createCommandMenuSlice';
import { createNavigationSlice } from '@/store/slices/navigationSlice/createNavigationSlice';
import { createSearchSlice } from '@/store/slices/searchSlice/createSearchSlice';

export const useAppStore = create<AppState>()((...a) => ({
	...createCommandMenuSlice(...a),
	...createNavigationSlice(...a),
	...createSearchSlice(...a),
}));
