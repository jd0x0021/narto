import type { CopyImageState } from '@/hooks/useCopyImageState';
import type { FileFormatType } from '@/services/providers/searchProvider.types';

type CopyStatusOverlayProps = {
	copyState: CopyImageState;
	copiedAsFile: boolean;
	format: FileFormatType;
	imageTitle: string;
};

/**
 * Displays the current status of an image copy operation over the grid image.
 *
 * @param copyState The current state of the copy operation.
 * @param format The file format for the copied content.
 */
export function CopyStatusOverlay({
	copyState,
	copiedAsFile,
	format,
	imageTitle,
}: CopyStatusOverlayProps) {
	const copiedFormat = format.toUpperCase() === 'WEBP' ? 'PNG' : format.toUpperCase();

	return (
		<div
			className={`absolute inset-0 flex items-center justify-center z-20 backdrop-blur-lg
				pointer-events-none transition-all duration-300 ease-out rounded-[4px]
				${copyState === 'copied' ? 'bg-narto-success/60' : ''}
				${copyState === 'error' ? 'bg-narto-error/60' : ''}
				${copyState !== 'idle' ? 'opacity-100 scale-100' : 'opacity-0'}`}
		>
			{copyState === 'copying' ? (
				<div className='size-8 border-4 border-gray-300 border-t-narto-accent/80 rounded-full animate-spin'></div>
			) : copyState === 'copied' ? (
				<div className='flex flex-col items-center justify-center text-center font-mono gap-[0.125rem] h-full w-full'>
					<span className='text-xs font-bold text-narto-text'>
						COPIED {copiedAsFile ? 'PNG FILE' : `${copiedFormat} URL`}
					</span>
					<span className='text-[0.563rem] text-narto-text/40'>{imageTitle}</span>
				</div>
			) : copyState === 'error' ? (
				<div className='flex flex-col items-center justify-center text-center font-mono gap-[0.125rem] h-full w-full'>
					<span className='text-xs font-bold text-narto-text'>COPY FAILED</span>
					<span className='text-[0.563rem] text-narto-text/80'>{imageTitle}</span>
				</div>
			) : null}
		</div>
	);
}
