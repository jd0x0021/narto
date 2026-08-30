import type { ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { useAppStore } from '@/store/useAppStore';

type MasonryGridProps = {
	children: ReactNode;
	columnCount: number;
	gap: number;
};

export function MasonryGrid({ children, columnCount, gap }: MasonryGridProps) {
	const masonryGridRef = useRef<HTMLDivElement>(null);
	const handleGridKeyDown = useAppStore((s) => s.handleGridKeyDown);
	const isGridPreviewReady = useAppStore((s) => s.isGridPreviewReady);

	const calculateLayout = useCallback(() => {
		const masonryGrid = masonryGridRef.current;
		if (!masonryGrid) return;

		const masonryGridWidth = masonryGrid.clientWidth;
		const columnWidth = Math.max(0, (masonryGridWidth - gap * (columnCount - 1)) / columnCount);
		const gridCells = Array.from(masonryGrid.children) as HTMLElement[];

		// PASS 1: Set widths before measuring heights.
		// This batches DOM writes without triggering layout recalculation (reflow). Heights depend on widths
		// (grid cells use aspect-ratio padding: paddingBottom = intrinsicRatio * 100%) - see `GridImage.tsx`.
		// By writing all widths first, the browser defers reflow until heights are read (using `gridCell.offsetHeight`).
		for (const gridCell of gridCells) {
			gridCell.style.width = `${columnWidth}px`;
		}

		// PASS 2: Measure heights and calculate positions.
		// Reading `gridCell.offsetHeight` triggers one reflow for all width writes (layout
		// thrashing prevention). We calculate absolute x/y positions for each grid cell based
		// on column distribution. Grid Cells are distributed row-major across 'columnCount' columns.
		const columnHeights = new Array<number>(columnCount).fill(0);
		const positions = gridCells.map((gridCell, index) => {
			const column = index % columnCount;
			const x = column * (columnWidth + gap);
			const y = columnHeights[column];

			columnHeights[column] += gridCell.offsetHeight + gap;

			return { gridCell, x, y };
		});

		// PASS 3: Apply transforms after all measurements complete.
		// Transforms do not affect layout (do not trigger reflow). Separating from measurements
		// keeps DOM writes batched separately from DOM reads. `translate()` moves tiles to their
		// calculated x/y positions while preserving DOM order for keyboard navigation.
		for (const { gridCell, x, y } of positions) {
			gridCell.style.transform = `translate(${x}px, ${y}px)`;
		}

		// PASS 4: Set parent container height.
		// Container height must fit all tiles across all columns.
		// Calculate max height from the tallest column, subtract one trailing gap.
		// This prevents extra empty space below the grid.
		const maxColumnHeight = Math.max(...columnHeights, 0);
		masonryGrid.style.height = `${Math.max(0, maxColumnHeight - gap)}px`;
	}, [columnCount, gap]);

	useEffect(() => {
		const ro = new ResizeObserver(() => {
			requestAnimationFrame(calculateLayout);
		});
		if (masonryGridRef.current) {
			ro.observe(masonryGridRef.current);
		}
		return () => {
			ro.disconnect();
		};
	}, [calculateLayout]);

	// Handle updates manually as images load or items change
	useLayoutEffect(() => {
		calculateLayout();
	}, [children, calculateLayout]);

	return (
		<div
			ref={masonryGridRef}
			className={`relative w-full outline-none
				${
					// Keep the y margin stable and avoid layout shifts when preview images are loading
					isGridPreviewReady ? 'my-2.5' : ''
				}`}
			tabIndex={-1}
			onKeyDown={handleGridKeyDown}
			role='grid'
		>
			{children}
		</div>
	);
}
