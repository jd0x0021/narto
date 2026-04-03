import type { KeyboardEvent, ReactNode } from 'react';
import { memo, useCallback, useEffect, useRef } from 'react';

import { useSearchStore } from '../store/useSearchStore';

const MasonryGrid = memo(
	({ children, columnCount, gap }: { children: ReactNode; columnCount: number; gap: number }) => {
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

		const moveSelection = useSearchStore((s) => s.moveSelection);
		const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);

		const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
			if (e.key === 'ArrowUp') {
				e.preventDefault();
				const sIndex = useSearchStore.getState().selectedIndex;
				if (sIndex !== null && sIndex < columnCount) {
					setSelectedIndex(null); // Return to input
				} else {
					moveSelection('up', columnCount);
				}
			} else if (e.key === 'ArrowDown') {
				e.preventDefault();
				moveSelection('down', columnCount);
			} else if (e.key === 'ArrowLeft') {
				e.preventDefault();
				moveSelection('left', columnCount);
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				moveSelection('right', columnCount);
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
	},
);

MasonryGrid.displayName = 'MasonryGrid';

export default MasonryGrid;
