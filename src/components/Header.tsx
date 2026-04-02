export default function Header() {
	return (
		<header className='flex items-center space-x-4 px-6 py-4 border-b border-narto-border/50'>
			<div className='flex items-center space-x-2'>
				<div className='w-1.5 h-6 bg-narto-accent rounded-sm'></div>
				<h1 className='text-xl font-bold tracking-widest text-narto-text'>NARTO</h1>
			</div>
			<div className='text-narto-border px-1'>|</div>
			<div className='flex items-center space-x-2 text-narto-muted text-sm font-medium tracking-wider'>
				<div className='w-2h-2 rounded-full bg-narto-accent/80'></div>
				<span>v1.0</span>
			</div>
		</header>
	);
}
