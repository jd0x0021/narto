import type { DragEvent, KeyboardEvent } from 'react';
import { memo, useEffect, useRef, useState } from 'react';

import type { NormalizedSearchResult } from '@/services/providers/types';
import { useSearchStore } from '@/store/useSearchStore';
import { copyImageFromUrl } from '@/utils/clipboard';

const GridImage = memo(
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

		const handleEnter = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				void copyImageFromUrl(item.originalUrl, item.format);
			}
		};

		const handleDragStart = (e: DragEvent) => {
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
				onClick={() => {
					setSelectedIndex(index);
				}}
				onKeyDown={handleEnter}
				draggable
				onDragStart={handleDragStart}
				role='gridcell'
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

GridImage.displayName = 'GridImage';

export default GridImage;
