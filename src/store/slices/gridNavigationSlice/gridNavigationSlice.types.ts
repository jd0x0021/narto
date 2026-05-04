export type GridDirection = 'up' | 'down' | 'left' | 'right';

export type GridNavigationSlice = {
	selectedGridCell: number | null;
	setSelectedGridCell: (index: number | null) => void;
	moveGridSelection: (direction: GridDirection, columns: number) => void;
};
