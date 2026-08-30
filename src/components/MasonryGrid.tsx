import type { ReactNode } from 'react';
import { memo, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { useAppStore } from '@/store/useAppStore';

type MasonryGridProps = {
	children: ReactNode;
	columnCount: number;
	gap: number;
};

function MasonryGridComponent({ children, columnCount, gap }: MasonryGridProps) {
	const masonryGridRef = useRef<HTMLDivElement>(null);
	const handleGridKeyDown = useAppStore((s) => s.handleGridKeyDown);

	const calculateLayout = useCallback(() => {
		const masonryGrid = masonryGridRef.current;
		if (!masonryGrid) return;

		const masonryGridWidth = masonryGrid.clientWidth;
		const columnWidth = Math.max(0, (masonryGridWidth - gap * (columnCount - 1)) / columnCount);
		const gridCells = Array.from(masonryGrid.children) as HTMLElement[];

		// Set widths before measuring heights.
		for (const gridCell of gridCells) {
			gridCell.style.width = `${columnWidth}px`;
		}

		const columnHeights = new Array<number>(columnCount).fill(0);
		const positions = gridCells.map((gridCell, index) => {
			const column = index % columnCount;
			const x = column * (columnWidth + gap);
			const y = columnHeights[column];

			columnHeights[column] += gridCell.offsetHeight + gap;

			return { gridCell, x, y };
		});

		// Apply transforms after all measurements.
		for (const { gridCell, x, y } of positions) {
			gridCell.style.transform = `translate(${x}px, ${y}px)`;
		}

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
			className='relative w-full outline-none'
			tabIndex={-1}
			onKeyDown={handleGridKeyDown}
			role='grid'
		>
			{children}
		</div>
	);
}

export const MasonryGrid = memo(MasonryGridComponent);
