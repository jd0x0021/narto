import type { AppStateCreator } from '@/store/appStore.types';
import type {
	GridDirection,
	GridNavigationSlice,
} from '@/store/slices/navigation/gridNavigationSlice/gridNavigationSlice.types';

export const createGridNavigationSlice: AppStateCreator<GridNavigationSlice> = (set, get) => ({
	selectedGridIndex: null,

	setSelectedGridIndex: (index: number | null) => {
		set({ selectedGridIndex: index });
	},

	moveGridSelection: (direction: GridDirection, columns: number) => {
		const { results, selectedGridIndex } = get();
		if (results.length === 0) return;

		if (selectedGridIndex === null) {
			set({ selectedGridIndex: 0 });
			return;
		}

		let nextIndex = selectedGridIndex;
		const count = results.length;

		switch (direction) {
			case 'right': {
				nextIndex = selectedGridIndex + 1;
				if (nextIndex >= count) nextIndex = 0;
				break;
			}
			case 'left': {
				nextIndex = selectedGridIndex - 1;
				if (nextIndex < 0) nextIndex = count - 1;
				break;
			}
			case 'down': {
				nextIndex = selectedGridIndex + columns;
				if (nextIndex >= count) {
					// wrap to top of next column if reached end of column visually
					// but row-major order: index 0,1,2 / 3,4,5.
					// Example: down from 5 (if 7 items), could be 5+3=8 >= 7. Next index should be next column?
					// Wait, "wrap to next column correctly".
					nextIndex = (selectedGridIndex % columns) + 1;
					if (nextIndex >= columns) nextIndex = 0;
				}
				break;
			}
			case 'up': {
				nextIndex = selectedGridIndex - columns;
				if (nextIndex < 0) {
					// parent component unsets selected index
					return;
				}
				break;
			}
			default: {
				const neverReachedDirection: never = direction;
				throw new Error(`Unhandled direction: ${JSON.stringify(neverReachedDirection)}`);
			}
		}

		if (nextIndex >= 0 && nextIndex < count) {
			set({ selectedGridIndex: nextIndex });
		}
	},
});
