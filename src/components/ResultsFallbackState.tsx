import { cva } from 'class-variance-authority';

import ExclamationPoint from '@/assets/exclamation_point.svg?react';
import naruto from '@/assets/naruto.png';

type ResultsFallbackStateType = 'empty' | 'error';

type ResultsFallbackStateProps = {
	fallbackState: ResultsFallbackStateType;
	message: string;
	addColoredMask?: boolean;
};

const resultsFallbackMessagePrefix: Record<ResultsFallbackStateType, string> = {
	empty: 'No Results Found For:',
	error: 'Error Loading Results:',
};

const resultsFallbackEmoji: Record<ResultsFallbackStateType, string> = {
	empty: '🔍',
	error: '💀',
};

const overlayVariants = cva(
	`absolute inset-0 mt-2 mr-2
	[mask-size:contain] [-webkit-mask-size:contain]
	[mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]
	[mask-position:center] [-webkit-mask-position:center]
	hover:opacity-50 transition-opacity duration-300`,
	{
		variants: {
			state: {
				empty: 'bg-narto-accent',
				error: 'bg-red-500',
			},
			visible: {
				true: 'opacity-40',
				false: 'opacity-0',
			},
		},
	},
);

const exclamationPointVariants = cva('absolute -top-[0.5rem] -left-[0.9rem] w-16', {
	variants: {
		state: {
			empty: 'text-narto-accent',
			error: 'text-red-500',
		},
	},
});

const emojiContainerVariants = cva(
	`absolute -bottom-4 -right-4 w-16 h-16 rounded-xl flex 
	items-center justify-center border backdrop-blur-sm`,
	{
		variants: {
			state: {
				empty: 'bg-narto-accent/30 border-narto-accent/40',
				error: 'bg-red-500/30 border-red-500/40',
			},
		},
	},
);

const messageVariants = cva('text-3xl font-black break-words', {
	variants: {
		state: {
			empty: 'text-narto-accent',
			error: 'text-red-500',
		},
	},
});

export default function ResultsFallbackState({
	fallbackState,
	message,
	addColoredMask = false,
}: ResultsFallbackStateProps) {
	return (
		<div className='flex pt-6 gap-6'>
			<div className='flex-1 flex items-center min-w-0'>
				<div className='relative border border-white/10 rounded-xl pt-2 pr-2'>
					<img src={naruto} alt='No results' className='w-full h-auto object-contain' />

					{/* Colored Image Mask Overlay */}
					{/* This mt-2 mr-2 is to align the overlay on the image's pt-2 pr-2 paddings */}
					<div
						className={overlayVariants({
							state: fallbackState,
							visible: addColoredMask,
						})}
						style={{
							maskImage: `url(${naruto})`,
							WebkitMaskImage: `url(${naruto})`,
						}}
					/>

					<ExclamationPoint className={exclamationPointVariants({ state: fallbackState })} />

					<div className={emojiContainerVariants({ state: fallbackState })}>
						<span className='text-3xl'>{resultsFallbackEmoji[fallbackState]}</span>
					</div>
				</div>
			</div>
			<div className='flex-1 flex flex-col justify-center text-center min-w-0'>
				<p className='text-base font-semibold text-narto-muted/75 mb-1'>
					{resultsFallbackMessagePrefix[fallbackState]}
				</p>
				<p className={messageVariants({ state: fallbackState })}>
					{fallbackState === 'empty' ? `"${message}"` : message}
				</p>
			</div>
		</div>
	);
}
