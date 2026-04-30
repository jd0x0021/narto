export type GridDirection = 'up' | 'down' | 'left' | 'right'; // update to GridDirection

export type GridNavigationSlice = {
	selectedGridIndex: number | null;
	setSelectedGridIndex: (index: number | null) => void;
	moveGridSelection: (direction: GridDirection, columns: number) => void;
};
