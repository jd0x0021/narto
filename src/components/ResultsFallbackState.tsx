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

					{/* This mt-2 mr-2 is to align the overlay on the image's pt-2 pr-2 paddings */}
					<div
						className={`absolute inset-0 ${fallbackState === 'empty' ? 'bg-narto-accent' : ''} ${addColoredMask ? 'opacity-40' : 'opacity-0'} mt-2 mr-2
								[mask-size:contain] [-webkit-mask-size:contain]
								[mask-repeat:no-repeat] [-webkit-mask-repeat:no-repeat]
								[mask-position:center] [-webkit-mask-position:center]
								hover:opacity-50 transition-opacity duration-300]`}
						style={{
							maskImage: `url(${naruto})`,
							WebkitMaskImage: `url(${naruto})`,
						}}
					/>

					<ExclamationPoint
						className={`absolute -top-[0.5rem] -left-[0.9rem] w-16 ${fallbackState === 'empty' ? 'text-narto-accent' : 'text-red-500'} `}
					/>

					<div
						className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-xl flex items-center justify-center border backdrop-blur-sm 
							${fallbackState === 'empty' ? 'bg-narto-accent/30 border-narto-accent/40' : 'bg-red-500/30 border-red-500/40'}`}
					>
						<span className='text-3xl'>{resultsFallbackEmoji[fallbackState]}</span>
					</div>
				</div>
			</div>
			<div className='flex-1 flex flex-col justify-center text-center min-w-0'>
				<p className='text-base font-semibold text-narto-muted/75 mb-1'>
					{resultsFallbackMessagePrefix[fallbackState]}
				</p>
				<p
					className={`text-3xl font-black break-words ${fallbackState === 'empty' ? 'text-narto-accent' : 'text-red-500'}`}
				>
					{fallbackState === 'empty' ? `"${message}"` : message}
				</p>
			</div>
		</div>
	);
}
