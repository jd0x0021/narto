import type { ReactNode } from 'react';

function Keycap({ children }: { children: ReactNode }) {
	return (
		<kbd className='inline-flex items-center h-5 px-1.5 text-[0.625rem] font-mono text-narto-muted bg-white/5 rounded border border-white/10 shadow-sm'>
			{children}
		</kbd>
	);
}

export default function Footer() {
	return (
		<footer className='flex items-center px-6 py-4 bg-narto-footer mt-auto'>
			<div className='flex items-center space-x-6 text-xs text-narto-muted font-medium tracking-wide'>
				<div className='flex items-center space-x-2'>
					<div className='flex items-center gap-1'>
						<Keycap>↑</Keycap>
						<Keycap>↓</Keycap>
						<Keycap>←</Keycap>
						<Keycap>→</Keycap>
					</div>
					<span className='text-narto-muted/60 text-[0.688rem]'>NAVIGATE</span>
				</div>

				<div className='w-[0.063rem] h-3 bg-white/10'></div>

				<div className='flex items-center space-x-2'>
					<Keycap>Enter</Keycap>
					<span className='text-narto-muted/60 text-[0.688rem]'>SELECT</span>
				</div>

				<div className='w-[0.063rem] h-3 bg-white/10'></div>

				<div className='flex items-center space-x-2'>
					<Keycap>Esc</Keycap>
					<span className='text-narto-muted/60 text-[0.688rem]'>CLOSE</span>
				</div>
			</div>
		</footer>
	);
}
