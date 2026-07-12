import { cva } from 'class-variance-authority';

import type { AppCommandType } from '@/services/providers/searchProvider.types';

type CommandChipProps = Readonly<{
	command: AppCommandType;
}>;

const commandChipVariants = cva(
	[
		'inline-flex h-6 items-center rounded-md px-1 text-base',
		'leading-6 text-narto-text align-middle pb-[0.15rem]',
	],
	{
		variants: {
			appCommand: {
				meme: 'bg-narto-accent',
				gif: 'bg-narto-gif',
				stk: 'bg-narto-stk',
			},
		},
	},
);

/**
 * A chip component for displaying a valid command in the search input. It
 * is styled to visually differentiate command styling from regular text.
 *
 * @param command - The valiid command to be displayed inside the chip.
 * @returns A styled span element containing the command.
 */
export function CommandChip({ command }: CommandChipProps) {
	return <span className={commandChipVariants({ appCommand: command })}>{`/${command}`}</span>;
}
