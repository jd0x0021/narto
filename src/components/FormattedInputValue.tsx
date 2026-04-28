import CommandChip from '@/components/CommandChip';
import type { AppCommandType } from '@/services/providers/searchProvider.types';

type FormattedInputValueProps = {
	command: AppCommandType;
	text: string;
	isTextMuted?: boolean;
};

/**
 * Renders the formatted version of the user's search input. This component is
 * responsible to conditionally format valid commands (e.g., "/meme") as styled
 * chips alongside the remaining query text or a contextual placeholder.
 *
 * @param command - The parsed command type from the search input.
 * @param text - The remaining query text after the command or a contextual placeholder.
 * @param isTextMuted - Optional flag to mute the text styling.
 * @returns A JSX Fragment containing the formatted input UI elements.
 */
export default function FormattedInputValue({
	command,
	text,
	isTextMuted,
}: FormattedInputValueProps) {
	return (
		<span className='text-base leading-6 flex items-baseline whitespace-pre'>
			<CommandChip command={command} />
			<span className={isTextMuted ? 'text-narto-muted/50' : 'text-narto-text'}>{text}</span>
		</span>
	);
}
