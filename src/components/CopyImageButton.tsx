import type { MouseEvent } from 'react';

type CopyImageButtonProps = {
	copying: boolean;
	onCopy: (e: MouseEvent<HTMLButtonElement>) => void;
};

export function CopyImageButton({ copying, onCopy }: CopyImageButtonProps) {
	return (
		<button
			type='button'
			tabIndex={-1}
			aria-label='Copy image'
			className={`flex items-center gap-1 pointer-events-auto absolute right-2 bottom-2 rounded-md  
				bg-narto-accent/90 px-2 py-1 text-xs text-narto-text transition-opacity duration-200 ease-out
				${copying ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100 hover:bg-narto-accent'}`}
			onClick={onCopy}
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
	);
}
