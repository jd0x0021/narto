export default function Header() {
	return (
		<header className='flex items-center space-x-4 px-6 py-3'>
			<div className='flex items-center space-x-2'>
				<div className='w-1.5 h-5 bg-narto-accent rounded-sm'></div>
				<h1 className='text-lg font-bold tracking-[0.1em] text-narto-text'>NARTO</h1>
			</div>

			<div className='h-4 w-[1px] bg-white/10 mx-1'></div>

			<div className='flex items-center gap-1.5'>
				<span className='w-2 h-2 rounded-full bg-orange-800/80'></span>
				<span className='text-narto-muted/50 font-mono tracking-wide'>v1.0</span>
			</div>
		</header>
	);
}
