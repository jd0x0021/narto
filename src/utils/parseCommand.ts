import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';

export type ParsedCommand = {
	rawInput: string;
	resolvedCommand: AppCommandType;
	query: string;
};

export const VALID_COMMAND_PREFIXES: readonly string[] = Object.values(AppCommand).map(
	(cmd) => `/${cmd} `,
);

export function isValidCommand(input: string): boolean {
	const trimmed = input.trimStart();
	return VALID_COMMAND_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

/**
 * Parses the raw user input to extract the command and query strings.
 *
 * The function handles the following cases:
 * 1. If the input starts with a valid command prefix (e.g., "/gif "), it extracts the command and the query.
 * 2. If the input starts with "/" but does not match any valid command, it treats it as an invalid command and defaults to "meme".
 * 3. If the input does not start with "/", it treats the entire input as a query for the default "meme" command.
 *
 * The {@link AppCommandType} defines the set of valid commands. This function ensures that the
 * resolved command is always a valid {@link AppCommandType}, defaulting to "meme" when necessary.
 *
 * @param input - The raw user input string to parse.
 * @returns An object containing:
 * 	- the original raw input
 * 	- the resolved command (used for provider-specific logic, and this is the string
 *  that will be displayed on the FormattedInputValue component)
 * 	- the extracted query string
 */
export function parseCommand(input: string): ParsedCommand {
	const trimmed = input.trimStart();

	if (!trimmed.startsWith('/')) {
		return { rawInput: input, resolvedCommand: AppCommand.Meme, query: input.trim() };
	}

	const match = trimmed.match(/^\/([^\s]+)\s*(.*)?$/);

	if (!match) {
		// Just "/"
		return { rawInput: input, resolvedCommand: AppCommand.Meme, query: '' };
	}

	const cmd = match[1].toLowerCase();
	const rest = match[2] || '';

	if (Object.values(AppCommand).includes(cmd as AppCommandType)) {
		return { rawInput: input, resolvedCommand: cmd as AppCommandType, query: rest };
	}

	// Invalid command
	return { rawInput: input, resolvedCommand: AppCommand.Meme, query: rest };
}
