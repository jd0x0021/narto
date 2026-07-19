import { CommandChip } from '@/components/CommandChip';
import { FormattedInputValue } from '@/components/FormattedInputValue';
import { APP_COMMAND, APP_COMMAND_FULL_NAME } from '@/services/providers/searchProvider.types';
import { useAppStore } from '@/store/useAppStore';
import { isValidCommand } from '@/utils/parseSearchInput';

/**
 * Renders the presentation layer shown under the native search input.
 *
 * This component mirrors the user's text input while visually enhancing it (e.g. adding
 * a command chip or placeholder text) without modifying the actual input value.
 * This component holds all the presentational states of the search input.
 */
export function SearchInputPresentationLayer() {
	const rawInput = useAppStore((s) => s.rawInput);
	const resolvedCommand = useAppStore((s) => s.resolvedCommand);
	const query = useAppStore((s) => s.query);

	// Show the default placeholder when the search input is empty.
	if (!rawInput) {
		return <span className='text-narto-muted/50'>Search KLIPY</span>;
	}

	const hasValidCommand = isValidCommand(rawInput);

	if (hasValidCommand) {
		const showPlaceholder = query.length === 0;

		return (
			<FormattedInputValue
				prefixElement={<CommandChip command={resolvedCommand} />}
				text={
					showPlaceholder
						? ` Search ${APP_COMMAND_FULL_NAME[resolvedCommand]}s...`
						: ` ${query}`
				}
				isTextMuted={showPlaceholder}
			/>
		);
	}

	const hasCommandPrefix = /^\/\S+\s+$/.test(rawInput);

	if (hasCommandPrefix) {
		return (
			<FormattedInputValue
				prefixElement={<span>{rawInput}</span>}
				text={`Search ${APP_COMMAND_FULL_NAME[APP_COMMAND.MEME]}s...`}
				isTextMuted
			/>
		);
	}

	// show the raw input if it the search input
	// doesn't have a valid command or a command prefix
	return <span className='whitespace-pre'>{rawInput}</span>;
}
