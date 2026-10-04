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
			className={`absolute inset-0 flex items-center justify-center z-20 backdrop-blur-lg
				bg-[radial-gradient(circle_at_center,rgba(12,12,11,0.4)_0%,rgba(12,12,11,0.8)_100%)]
				pointer-events-none transition-all duration-300 ease-out
				${copyState !== 'idle' ? 'opacity-100 scale-100' : 'opacity-0'}`}
		>
			<div className='flex flex-col items-center justify-center text-center font-mono gap-[0.125rem] h-full w-full'>
				<span className='text-xs font-bold text-emerald-500'>
					COPIED {copiedAsFile ? 'PNG FILE' : `${copiedFormat} URL`}
				</span>
				<span className='text-[0.563rem] text-narto-text/40'>{'aaaaaaaaaaa'}</span>
			</div>
		</div>
	);
}
