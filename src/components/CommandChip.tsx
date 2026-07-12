import { cva } from 'class-variance-authority';

import { APP_COMMAND, type AppCommandType } from '@/services/providers/searchProvider.types';

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
				[APP_COMMAND.MEME]: 'bg-narto-accent',
				[APP_COMMAND.GIF]: 'bg-narto-gif',
				[APP_COMMAND.STICKER]: 'bg-narto-stk',
			} as const satisfies Record<AppCommandType, string>,
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
