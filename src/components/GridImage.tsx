import type { DragEvent, KeyboardEvent, MouseEvent } from 'react';
import { memo, useEffect, useRef, useState } from 'react';

import type { NormalizedSearchResult } from '@/services/providers/searchProvider.types';
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
		const [copying, setCopying] = useState(false);
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
				setCopying(true);
				await copyImageFromUrl(item.originalUrl, item.format);
				setCopying(false);
				setIsCopied(true);
				setTimeout(() => {
					setIsCopied(false);
				}, 2000);
			} catch {
				setCopyErrored(true);
				setCopying(false);
				setTimeout(() => {
					setCopyErrored(false);
				}, 2000);
			}
		};

		const handleCopyOnEvent = (
			e: KeyboardEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>,
		): void => {
			e.stopPropagation();
			void handleCopy();
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
				className={`group absolute top-0 left-0 transition-shadow outline-none cursor-pointer overflow-hidden leading-none select-none rounded-narto-sm border-[0.188rem]
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
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						handleCopyOnEvent(e);
					}
				}}
				draggable
				onDragStart={handleDragStart}
				role='gridcell'
			>
				<div className='w-full relative' style={{ paddingBottom: `${intrinsicRatio * 100}%` }}>
					{/* Blur preview */}
					<div
						className='absolute inset-0 bg-cover bg-center bg-no-repeat blur-[0.125rem] transition-opacity duration-300'
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

					{/* Copy button shown on hover */}
					<button
						type='button'
						tabIndex={-1}
						aria-label='Copy image'
						className={`flex items-center gap-1 pointer-events-auto absolute right-2 bottom-2 rounded-md  
								bg-narto-accent/90 px-2 py-1 text-xs text-white transition-opacity duration-200 ease-out
								${copying ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100 hover:bg-narto-accent'}`}
						onClick={handleCopyOnEvent}
					>
						<svg
							className='w-3'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
							<path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
						</svg>
						Copy
					</button>

					{/* Status overlay (Copying / Copied / Error) */}
					<div
						className={`absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none transition-all duration-300 ease-out ${
							copying || isCopied || copyErrored ? 'opacity-100 scale-100' : 'opacity-0'
						}`}
					>
						{copying ? (
							<div className='size-8 border-4 border-gray-300 border-t-narto-accent/80 rounded-full animate-spin'></div>
						) : isCopied ? (
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
