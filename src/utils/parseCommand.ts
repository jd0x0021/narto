export type CommandType = 'meme' | 'gif';

export interface ParsedCommand {
	rawInput: string;
	resolvedCommand: CommandType;
	query: string;
}

export function parseCommand(input: string): ParsedCommand {
	const trimmed = input.trimStart();

	if (!trimmed.startsWith('/')) {
		return { rawInput: input, resolvedCommand: 'meme', query: input.trim() };
	}

	const match = trimmed.match(/^\/([^\s]+)\s*(.*)?$/);

	if (!match) {
		// Just "/"
		return { rawInput: input, resolvedCommand: 'meme', query: '' };
	}

	const cmd = match[1].toLowerCase();
	const rest = match[2] || '';

	if (cmd === 'meme') {
		return { rawInput: input, resolvedCommand: 'meme', query: rest };
	}
	if (cmd === 'gif') {
		return { rawInput: input, resolvedCommand: 'gif', query: rest };
	}

	// Invalid command
	return { rawInput: input, resolvedCommand: 'meme', query: rest };
}
