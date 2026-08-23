import type { CopyImageState } from '@/hooks/useCopyImageState';
import type { FileFormatType } from '@/services/providers/searchProvider.types';

type CopyStatusOverlayProps = {
	copyState: CopyImageState;
	copiedAsFile: boolean;
	format: FileFormatType;
};

/**
 * Displays the current status of an image copy operation over the grid image.
 *
 * @param copyState The current state of the copy operation.
 * @param format The file format for the copied content.
 */
export function CopyStatusOverlay({ copyState, copiedAsFile, format }: CopyStatusOverlayProps) {
	const copiedFormat = format.toUpperCase() === 'WEBP' ? 'PNG' : format.toUpperCase();

	return (
		<div
			className={`absolute inset-0 flex items-center justify-center 
				bg-black/40 z-20 pointer-events-none transition-all duration-300 ease-out 
				${copyState !== 'idle' ? 'opacity-100 scale-100' : 'opacity-0'}`}
		>
			{copyState === 'copying' ? (
				<div className='size-8 border-4 border-gray-300 border-t-narto-accent/80 rounded-full animate-spin'></div>
			) : copyState === 'copied' ? (
				<span className='bg-green-500 text-narto-text rounded-md px-2 py-1 text-xs mx-2 text-center max-w-[90%] shadow-sm'>
					{/* see PROJECT_CONTEXT.md for more information */}
					Copied {copiedAsFile ? 'PNG File' : `${copiedFormat} URL`} 😼
				</span>
			) : copyState === 'error' ? (
				<span className='bg-red-600 text-narto-text rounded-md px-2 py-1 text-xs mx-2 text-center max-w-[90%] shadow-sm'>
					Copy failed 💀
				</span>
			) : null}
		</div>
	);
}
