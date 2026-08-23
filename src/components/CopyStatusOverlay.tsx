import type { FileFormatType } from '@/services/providers/searchProvider.types';

type CopyStatusOverlayProps = {
	copying: boolean;
	isCopied: boolean;
	copiedAsFile: boolean;
	copyErrored: boolean;
	format: FileFormatType;
};

/**
 * Displays the current status of an image copy operation over the image.
 *
 * @param copying Whether a copy operation is currently in progress.
 * @param isCopied Whether the image was copied successfully.
 * @param copyErrored Whether the copy operation failed.
 * @param format The file format for the copied content.
 */
export function CopyStatusOverlay({
	copying,
	isCopied,
	copiedAsFile,
	copyErrored,
	format,
}: CopyStatusOverlayProps) {
	const copiedFormat = format.toUpperCase() === 'WEBP' ? 'PNG' : format.toUpperCase();

	return (
		<div
			className={`absolute inset-0 flex items-center justify-center 
				bg-black/40 z-20 pointer-events-none transition-all duration-300 ease-out 
				${copying || isCopied || copyErrored ? 'opacity-100 scale-100' : 'opacity-0'}`}
		>
			{copying ? (
				<div className='size-8 border-4 border-gray-300 border-t-narto-accent/80 rounded-full animate-spin'></div>
			) : isCopied ? (
				<span className='bg-green-500 text-narto-text rounded-md px-2 py-1 text-xs mx-2 text-center max-w-[90%] shadow-sm'>
					{/* see PROJECT_CONTEXT.md for more information */}
					Copied {copiedAsFile ? 'PNG File' : `${copiedFormat} URL`} 😼
				</span>
			) : copyErrored ? (
				<span className='bg-red-600 text-narto-text rounded-md px-2 py-1 text-xs mx-2 text-center max-w-[90%] shadow-sm'>
					Copy failed 💀
				</span>
			) : null}
		</div>
	);
}
