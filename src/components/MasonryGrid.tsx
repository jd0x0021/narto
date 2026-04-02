import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchStore, type NormalizedSearchResult } from '../store/useSearchStore';
import { copyImageFromUrl } from '../utils/clipboard';

const MasonryGrid = React.memo(
	({
		children,
		columnCount,
		gap,
	}: {
		children: React.ReactNode;
		columnCount: number;
		gap: number;
	}) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const [containerHeight, setContainerHeight] = useState(0);

		const calculateLayout = useCallback(() => {
			if (!containerRef.current) return;

			const container = containerRef.current;
			const containerWidth = container.clientWidth;
			const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

			const columnHeights = new Array(columnCount).fill(0);
			const childrenNodes = Array.from(container.children) as HTMLElement[];

			childrenNodes.forEach((child, index) => {
				const col = index % columnCount;
				const x = col * (columnWidth + gap);
				const y = columnHeights[col];

				child.style.width = `${columnWidth}px`;
				child.style.transform = `translate(${x}px, ${y}px)`;

				columnHeights[col] += child.offsetHeight + gap;
			});

			setContainerHeight(Math.max(...columnHeights));
		}, [columnCount, gap]);

		useEffect(() => {
			const ro = new ResizeObserver(() => {
				requestAnimationFrame(calculateLayout);
			});
			if (containerRef.current) {
				ro.observe(containerRef.current);
			}
			return () => ro.disconnect();
		}, [calculateLayout]);

		// Handle updates manually as images load or items change
		useEffect(() => {
			calculateLayout();
		}, [children, calculateLayout]);

		const moveSelection = useSearchStore((s) => s.moveSelection);
		const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);

		const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
				style={{ height: containerHeight }}
				tabIndex={-1}
				onKeyDown={handleKeyDown}
			>
				{children}
			</div>
		);
	},
);

// A wrapper to extract dimensions properly before layout recalculation
export const GridImage = React.memo(
	({
		item,
		index,
	}: {
		item: NormalizedSearchResult;
		index: number;
		calculateLayout?: () => void;
	}) => {
		const selectedIndex = useSearchStore((s) => s.selectedIndex);
		const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);
		const isSelected = selectedIndex === index;

		const [displayLoaded, setDisplayLoaded] = useState(false);
		const ref = useRef<HTMLDivElement>(null);

		// Focus tracking
		useEffect(() => {
			if (isSelected && ref.current) {
				ref.current.focus({ preventScroll: true });
				// native scroll into view if needed
				ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		}, [isSelected]);

		const handleEnter = async (e: React.KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				await copyImageFromUrl(item.originalUrl, item.format);
			}
		};

		const handleDragStart = (e: React.DragEvent) => {
			e.dataTransfer.setData('text/uri-list', item.originalUrl);
			e.dataTransfer.setData('text/plain', item.originalUrl);
		};

		const intrinsicRatio = item.width && item.height ? item.height / item.width : 1;

		return (
			<div
				ref={ref}
				tabIndex={-1}
				className={`absolute top-0 left-0 transition-shadow outline-none cursor-pointer overflow-hidden leading-none select-none rounded-narto-sm border-2
${isSelected ? 'border-narto-accent shadow-[0_4px_15px_rgba(255,107,0,0.3)] z-10' : 'border-transparent hover:border-narto-border opacity-90 hover:opacity-100 z-0'}
`}
				style={
					{
						// Maintain intrinsic aspect ratio for the height automatically via padding or pre-calculating the relative spacing
					}
				}
				onClick={() => setSelectedIndex(index)}
				onKeyDown={handleEnter}
				draggable
				onDragStart={handleDragStart}
			>
				<div className='w-full relative' style={{ paddingBottom: `${intrinsicRatio * 100}%` }}>
					{/* Blur preview */}
					<div
						className='absolute inset-0 bg-cover bg-center bg-no-repeat blur-[2px] transition-opacity duration-300'
						style={{
							backgroundImage: `url(${item.blurPreview})`,
							opacity: displayLoaded ? 0 : 1,
						}}
					/>
					{/* Main image */}
					<img
						src={item.displayUrl}
						className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${displayLoaded ? 'opacity-100' : 'opacity-0'}`}
						onLoad={() => {
							setDisplayLoaded(true);
						}}
						alt=''
						loading='lazy'
					/>
				</div>
			</div>
		);
	},
);

export default MasonryGrid;
