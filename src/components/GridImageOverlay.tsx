import { memo } from 'react';

import type { DisplayImageLoadState } from '@/hooks/useImageRetry';

export type GridImageOverlayProps = {
	displayImageLoadState: DisplayImageLoadState;
};

function GridImageOverlayComponent({ displayImageLoadState }: GridImageOverlayProps) {
	return (
		<>
			{/* Loading overlay */}
			<div
				className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity 
					duration-300 ${displayImageLoadState === 'loading' ? 'opacity-100' : 'opacity-0'}`}
			>
				<div
					className="absolute inset-0 bg-narto-main/30 before:absolute before:inset-y-0
					before:left-0 before:w-full before:bg-gradient-to-r before:from-transparent
					before:via-gray-50/50 before:to-transparent before:animate-skeleton before:content-['']"
				/>
			</div>

			{/* Error overlay */}
			<div
				className={`flex items-center justify-center p-2 backdrop-blur-[1px] text-narto-text bg-narto-error/60 
					absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-300
					${displayImageLoadState === 'retrying' || displayImageLoadState === 'failed' ? 'opacity-100' : 'opacity-0'}`}
			>
				<span className='text-center'>
					<span className='text-sm [filter:drop-shadow(0_0_0.5px_#111116)]'>💀 </span>
					<span className='text-xs font-medium font-mono'>
						{displayImageLoadState === 'failed'
							? "can't load rn"
							: 'Reloading image…'.split('').map((char, index) => (
									<span
										key={index}
										className='inline-block animate-text-wave'
										style={{ animationDelay: `${index * 40}ms` }}
									>
										{char === ' ' ? '\u00A0' : char}
									</span>
								))}
					</span>
				</span>
			</div>
		</>
	);
}

/**
 * Renders the shared visual overlay for grid image loading states.
 *
 * This component presents a non-interactive layer that communicates whether an
 * image is still loading, is being retried after a failure, or has failed to
 * load entirely. It keeps the overlay transparent for healthy states and uses
 * lightweight transitions to surface loading animations or error messaging.
 *
 * @param displayImageLoadState - The current lifecycle state of the image.
 */
export const GridImageOverlay = memo(GridImageOverlayComponent);
