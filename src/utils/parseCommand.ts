import type { CommandType } from '@/services/providers/types';
import { VALID_COMMANDS } from '@/services/providers/types';

export type ParsedCommand = {
	rawInput: string;
	resolvedCommand: CommandType;
	query: string;
};

export const VALID_COMMAND_PREFIXES: readonly string[] = Object.values(VALID_COMMANDS).map(
	(cmd) => `/${cmd} `,
);

export function isValidCommand(input: string): boolean {
	const trimmed = input.trimStart();
	return VALID_COMMAND_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

export function parseCommand(input: string): ParsedCommand {
	const trimmed = input.trimStart();

	if (!trimmed.startsWith('/')) {
		return { rawInput: input, resolvedCommand: VALID_COMMANDS.MEME, query: input.trim() };
	}

	const match = trimmed.match(/^\/([^\s]+)\s*(.*)?$/);

	if (!match) {
		// Just "/"
		return { rawInput: input, resolvedCommand: VALID_COMMANDS.MEME, query: '' };
	}

	const cmd = match[1].toLowerCase();
	const rest = match[2] || '';

	if (Object.values(VALID_COMMANDS).includes(cmd as CommandType)) {
		return { rawInput: input, resolvedCommand: cmd as CommandType, query: rest };
	}

	// Invalid command
	return { rawInput: input, resolvedCommand: VALID_COMMANDS.MEME, query: rest };
}
