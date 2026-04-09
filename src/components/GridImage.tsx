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
		const isSelected = useSearchStore((s) => s.selectedIndex === index);
		const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);

		const [displayLoaded, setDisplayLoaded] = useState(false);
		const [isCopied, setIsCopied] = useState(false);
		const [copyErrored, setCopyErrored] = useState(false);
		const ref = useRef<HTMLDivElement>(null);

		// Focus tracking
		useEffect(() => {
			if (isSelected && ref.current) {
				ref.current.focus({ preventScroll: true });
				// native scroll into view if needed
				ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		}, [isSelected]);

		const handleCopy = async (): Promise<void> => {
			try {
				await copyImageFromUrl(item.originalUrl, item.format);
			} catch (error: unknown) {
				console.error('Copy failed', error);
				setCopyErrored(true);
				setTimeout(() => {
					setCopyErrored(false);
				}, 2000);
			}
		};

		const handleCopyOnEnter = (e: KeyboardEvent): void => {
			if (e.key === 'Enter') {
				e.preventDefault();
				setCopyErrored(false);
				setIsCopied(true);
				setTimeout(() => {
					setIsCopied(false);
				}, 2000);
				void handleCopy();
			}
		};

		const handleDragStart = (e: DragEvent): void => {
			e.dataTransfer.setData('text/uri-list', item.originalUrl);
			e.dataTransfer.setData('text/plain', item.originalUrl);
		};

		const intrinsicRatio = item.width && item.height ? item.height / item.width : 1;

		return (
			<div
				ref={ref}
				tabIndex={0}
				className={`absolute top-0 left-0 transition-shadow outline-none cursor-pointer overflow-hidden leading-none select-none rounded-narto-sm border-[3px]
					${
						isSelected
							? 'border-narto-accent shadow-[0_4px_15px_rgba(255,107,0,0.3)] z-10'
							: 'border-transparent hover:border-narto-accent/40 opacity-90 hover:opacity-100 z-0'
					}`}
				onClick={() => {
					setSelectedIndex(index);
				}}
				onFocus={() => {
					setSelectedIndex(index);
				}}
				onKeyDown={handleCopyOnEnter}
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

					{/* Status overlay (Copied / Error) */}
					<div
						className={`absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none transition-all duration-300 ease-out ${
							isCopied || copyErrored ? 'opacity-100 scale-100' : 'opacity-0'
						}`}
					>
						{isCopied ? (
							<span className='bg-green-500 text-white rounded-md px-2 py-1 text-sm mx-2 text-center max-w-[90%] shadow-sm'>
								Copied 😼
							</span>
						) : copyErrored ? (
							<span className='bg-red-600 text-white rounded-md px-2 py-1 text-sm mx-2 text-center max-w-[90%] shadow-sm'>
								Copy failed 💀
							</span>
						) : null}
					</div>
				</div>
			</div>
		);
	},
);

GridImage.displayName = 'GridImage';

export default GridImage;
