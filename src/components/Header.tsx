export default function Header() {
	return (
		<header className='flex w-full items-stretch justify-between px-6 py-3'>
			<div className='flex items-center space-x-4'>
				<div className='flex items-center space-x-2'>
					<div className='w-1.5 h-5 bg-narto-accent rounded-sm'></div>
					<h1 className='text-lg font-bold tracking-[0.1em] text-narto-text'>NARTO</h1>
				</div>

				<div className='h-4 w-[0.063rem] bg-white/10 mx-1'></div>

				<div className='flex items-center gap-1.5'>
					<span className='w-2 h-2 rounded-full bg-orange-800/80'></span>
					<span className='text-narto-muted/50 font-mono tracking-wide'>v1.0</span>
				</div>
			</div>

			<div
				className='flex shrink-0 items-center justify-center self-stretch gap-1.5 rounded-narto-full border border-white/[0.04] bg-narto-pill px-3'
				role='status'
				aria-live='polite'
			>
				<span className='relative flex h-2 w-2 shrink-0 items-center justify-center'>
					<span
						className='absolute inset-0 animate-ping rounded-full bg-narto-success opacity-50'
						aria-hidden
					/>
					<span className='relative h-2 w-2 rounded-full bg-narto-success' aria-hidden />
				</span>

				<span className='leading-none text-xs tracking-wide text-narto-success'>Connected</span>
			</div>
		</header>
	);
}
