import { cva } from 'class-variance-authority';

import { useAppStore } from '@/store/useAppStore';

const statusDotVariants = cva('relative h-2 w-2 rounded-full', {
	variants: {
		status: {
			idle: 'bg-narto-accent',
			loading: 'bg-narto-loading',
			success: 'bg-narto-success',
			error: 'bg-narto-error',
		},
	},
});

const statusPingVariants = cva('absolute inset-0 rounded-full opacity-50', {
	variants: {
		status: {
			idle: 'animate-ping bg-narto-accent',
			loading: 'animate-ping bg-narto-loading',
			success: 'animate-ping bg-narto-success',
			error: 'animate-ping bg-narto-error',
		},
	},
});

const statusTextVariants = cva('font-mono leading-none text-xs tracking-wide capitalize', {
	variants: {
		status: {
			idle: 'text-narto-accent',
			loading: 'text-narto-loading',
			success: 'text-narto-success',
			error: 'text-narto-error',
		},
	},
});

export default function Header() {
	const status = useAppStore((s) => s.status);

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
					<span className={statusPingVariants({ status })} aria-hidden />
					<span className={statusDotVariants({ status })} aria-hidden />
				</span>

				<span className={statusTextVariants({ status })}>{status}</span>
			</div>
		</header>
	);
}
