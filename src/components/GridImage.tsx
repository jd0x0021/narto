import { memo, useEffect, useRef } from 'react';

import { CopyImageButton } from '@/components/CopyImageButton';
import { CopyStatusOverlay } from '@/components/CopyStatusOverlay';
import { GridImageOverlay } from '@/components/GridImageOverlay';
import { useCopyImageState } from '@/hooks/useCopyImageState';
import { useImageRetry } from '@/hooks/useImageRetry';
import type { NormalizedImageData } from '@/services/providers/searchProvider.types';
import { useAppStore } from '@/store/useAppStore';

type GridImageProps = {
	image: NormalizedImageData;
	index: number;
	handlePreviewImageLoad: (imageId: number) => void;
	handleDisplayImageLoad: (imageId: number) => void;
};

function GridImageComponent({
	image,
	index,
	handlePreviewImageLoad,
	handleDisplayImageLoad,
}: GridImageProps) {
	const gridImageCellRef = useRef<HTMLDivElement>(null);

	const isSelected = useAppStore((s) => s.selectedGridCell === index);
	const setSelectedGridCell = useAppStore((s) => s.setSelectedGridCell);

	const { copying, isCopied, copiedAsFile, copyErrored, handleCopyOnEvent } = useCopyImageState(
		image.highResUrl,
		image.format,
	);

	const {
		displayImageSrc,
		displayImageLoadState,
		setDisplayImageLoadState,
		handleDisplayImageError,
	} = useImageRetry(image.id, image.displayUrl);

	// Focus tracking
	useEffect(() => {
		if (isSelected && gridImageCellRef.current) {
			gridImageCellRef.current.focus({ preventScroll: true });
			// native scroll into view if needed
			gridImageCellRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, [isSelected]);

	const intrinsicRatio = image.width && image.height ? image.height / image.width : 1;

	return (
		<div
			ref={gridImageCellRef}
			tabIndex={0}
			className={`group absolute top-0 left-0 transition-shadow outline-none cursor-pointer
				overflow-hidden leading-none select-none rounded-narto-sm border-[0.188rem]
				${
					isSelected
						? 'border-narto-accent shadow-[0_4px_15px_rgba(255,107,0,0.3)] z-10'
						: 'border-transparent hover:border-narto-accent/40 opacity-90 hover:opacity-100 z-0'
				}`}
			onClick={() => {
				setSelectedGridCell(index);
			}}
			onFocus={() => {
				setSelectedGridCell(index);
			}}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					handleCopyOnEvent(e);
				}
			}}
			role='gridcell'
		>
			<div className='w-full relative' style={{ paddingBottom: `${intrinsicRatio * 100}%` }}>
				{/* Blur preview */}
				<img
					src={image.previewUrl}
					alt={`Preview of ${image.title}`}
					className={`absolute inset-0 h-full w-full object-cover blur-sm transition-opacity duration-300
						${displayImageLoadState === 'loaded' ? 'opacity-0' : 'opacity-100'}`}
					onLoad={() => {
						handlePreviewImageLoad(image.id);
					}}
				/>

				{/* Display image */}
				<img
					src={displayImageSrc}
					className={`absolute inset-0 w-full h-full object-cover active:cursor-grabbing transition-opacity
						duration-300 ${displayImageLoadState === 'loaded' ? 'opacity-100' : 'opacity-0 cursor-wait'}`}
					onLoad={() => {
						setDisplayImageLoadState('loaded');
						handleDisplayImageLoad(image.id);
					}}
					onError={handleDisplayImageError}
					alt={image.title}
					loading='lazy'
					draggable
				/>

				{/* Image Overlay */}
				<GridImageOverlay displayImageLoadState={displayImageLoadState} />

				{/* Copy button shown on hover */}
				<CopyImageButton copying={copying} onCopy={handleCopyOnEvent} />

				{/* Status overlay (Copying / Copied / Error) */}
				<CopyStatusOverlay
					copying={copying}
					isCopied={isCopied}
					copiedAsFile={copiedAsFile}
					copyErrored={copyErrored}
					format={image.format}
				/>
			</div>
		</div>
	);
}

export const GridImage = memo(GridImageComponent);
