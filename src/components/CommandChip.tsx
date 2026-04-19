import type { AppCommandType } from '@/services/providers/searchProvider.types';

type CommandChipProps = Readonly<{
	command: AppCommandType;
}>;

export default function CommandChip({ command }: CommandChipProps) {
	return (
		<span
			className='inline-flex h-6 items-center rounded-md bg-narto-accent
			px-1 text-base leading-6 text-narto-text align-middle pb-[0.15rem]'
		>
			{`/${command}`}
		</span>
	);
}
