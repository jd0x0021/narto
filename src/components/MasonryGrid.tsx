import type { ReactNode } from 'react';
import { memo, useCallback, useEffect, useRef } from 'react';

import { useAppStore } from '@/store/useAppStore';

type MasonryGridProps = {
	children: ReactNode;
	columnCount: number;
	gap: number;
};

function MasonryGridComponent({ children, columnCount, gap }: MasonryGridProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const handleGridKeyDown = useAppStore((s) => s.handleGridKeyDown);

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

	return (
		<div
			ref={containerRef}
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
