import type { KeyboardEvent, ReactNode } from 'react';
import { memo, useCallback, useEffect, useRef } from 'react';

import { useAppStore } from '@/store/useAppStore';

type MasonryGridProps = {
	children: ReactNode;
	columnCount: number;
	gap: number;
};
const MasonryGrid = memo(({ children, columnCount, gap }: MasonryGridProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const calculateLayout = useCallback(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const containerWidth = container.clientWidth;
		const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

		const columnHeights = new Array<number>(columnCount).fill(0);
		const childrenNodes = Array.from(container.children) as HTMLElement[];

		childrenNodes.forEach((child, index) => {
			const col = index % columnCount;
			const x = col * (columnWidth + gap);
			const y = columnHeights[col];

			child.style.width = `${columnWidth}px`;
			child.style.transform = `translate(${x}px, ${y}px)`;

			columnHeights[col] += child.offsetHeight + gap;
		});

		container.style.height = `${Math.max(...columnHeights)}px`;
	}, [columnCount, gap]);

	useEffect(() => {
		const ro = new ResizeObserver(() => {
			requestAnimationFrame(calculateLayout);
		});
		if (containerRef.current) {
			ro.observe(containerRef.current);
		}
		return () => {
			ro.disconnect();
		};
	}, [calculateLayout]);

	// Handle updates manually as images load or items change
	useEffect(() => {
		calculateLayout();
	}, [children, calculateLayout]);

	const moveGridSelection = useAppStore((s) => s.moveGridSelection);
	const setSelectedGridCell = useAppStore((s) => s.setSelectedGridCell);

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			const selectedGridCellIndex = useAppStore.getState().selectedGridCell;
			if (selectedGridCellIndex !== null && selectedGridCellIndex < columnCount) {
				setSelectedGridCell(null); // Return to input
			} else {
				moveGridSelection('up', columnCount);
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			moveGridSelection('down', columnCount);
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			moveGridSelection('left', columnCount);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			moveGridSelection('right', columnCount);
		}
	};

	return (
		<div
			ref={containerRef}
			className='relative w-full outline-none'
			tabIndex={-1}
			onKeyDown={handleKeyDown}
			role='grid'
		>
			{children}
		</div>
	);
});

MasonryGrid.displayName = 'MasonryGrid';

export default MasonryGrid;
