import type { AppStateCreator } from '@/store/appStore.types';
import type {
	GridDirection,
	GridNavigationSlice,
} from '@/store/slices/gridNavigationSlice/gridNavigationSlice.types';

/**
 * This slice manages the keyboard navigation logic for the 2D image grid, handling
 * boundary conditions, column wrapping, and the currently selected grid cell index.
 *
 * @param set - The Zustand setter function for updating state.
 * @param get - The Zustand getter function for reading current state.
 * @returns The initial state and actions for grid navigation.
 */
export const createGridNavigationSlice: AppStateCreator<GridNavigationSlice> = (set, get) =>
	({
		selectedGridCell: null,

		setSelectedGridCell: (index: number | null) => {
			set({ selectedGridCell: index });
		},

		moveGridSelection: (direction: GridDirection, columns: number) => {
			const { results, selectedGridCell } = get();
			if (results.length === 0) return;

			if (selectedGridCell === null) {
				set({ selectedGridCell: 0 });
				return;
			}

			let nextGridCellIndex = selectedGridCell;
			const count = results.length;

			switch (direction) {
				case 'right': {
					nextGridCellIndex = selectedGridCell + 1;
					if (nextGridCellIndex >= count) nextGridCellIndex = 0;
					break;
				}
				case 'left': {
					nextGridCellIndex = selectedGridCell - 1;
					if (nextGridCellIndex < 0) nextGridCellIndex = count - 1;
					break;
				}
				case 'down': {
					nextGridCellIndex = selectedGridCell + columns;
					if (nextGridCellIndex >= count) {
						// wrap to top of next column if reached end of column visually
						// but row-major order: index 0,1,2 / 3,4,5.
						// Example: down from 5 (if 7 items), could be 5+3=8 >= 7. Next index should be next column?
						// Wait, "wrap to next column correctly".
						nextGridCellIndex = (selectedGridCell % columns) + 1;
						if (nextGridCellIndex >= columns) nextGridCellIndex = 0;
					}
					break;
				}
				case 'up': {
					nextGridCellIndex = selectedGridCell - columns;
					if (nextGridCellIndex < 0) {
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

			if (nextGridCellIndex >= 0 && nextGridCellIndex < count) {
				set({ selectedGridCell: nextGridCellIndex });
			}
		},
	}) satisfies GridNavigationSlice;
