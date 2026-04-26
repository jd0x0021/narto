import CommandChip from '@/components/CommandChip';
import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { useAppStore } from '@/store/useAppStore';
import { isValidCommand } from '@/utils/parseCommand';

type FormattedInputValueProps = {
	rawInput: string;
};

/**
 * Renders the formatted version of the user's search input. This component is
 * responsible to conditionally format valid commands (e.g., "/meme") as styled
 * chips alongside the remaining query text or a contextual placeholder.
 *
 * @param rawInput - The raw, unparsed string currently entered in the search bar (SearchInput.tsx).
 * @returns A JSX Fragment containing the formatted input UI elements.
 */
export default function FormattedInputValue({ rawInput }: FormattedInputValueProps) {
	const hasValidCommand: boolean = isValidCommand(rawInput);
	const query: string = useAppStore((s) => s.query);
	const resolvedCommand: AppCommandType = useAppStore((s) => s.resolvedCommand);

	if (hasValidCommand) {
		const showPlaceholder: boolean = query.length === 0;

		return (
			<>
				<span className='text-base leading-6 flex items-baseline whitespace-pre'>
					<CommandChip command={resolvedCommand} />

					{showPlaceholder ? (
						<span className='text-narto-muted/50'> Search {resolvedCommand}s...</span>
					) : (
						<span className='text-narto-text'>{` ${query}`}</span>
					)}
				</span>
			</>
		);
	}

	return (
		<>
			<span>{rawInput}</span>
			{!rawInput ? <span className='text-narto-muted/50'>Search KLIPY</span> : null}
		</>
	);
}
