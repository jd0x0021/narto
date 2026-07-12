export type FileFormatType = 'webp' | 'gif';

/**
 * These are the only VALID app-level commands that the system recognizes. Each command represents
 * a distinct category of search and is independent of any provider-specific implementation.
 */
export const APP_COMMAND = {
	MEME: 'meme',
	GIF: 'gif',
	STICKER: 'stk',
} as const;

/**
 * Represents the set of app-level search commands supported by the system.
 *
 * These commands are domain-level abstractions and are independent of any
 * specific provider implementation. Each provider is responsible for mapping
 * these commands to its own internal or API-specific usage.
 *
 * A command can be mapped to different provider-specific values depending on the provider's API design.
 *
 * Example:
 * - "meme" → may map to "meme", "static_meme", etc.
 * - "gif"  → may map to "gif", "gifs/search", etc.
 * - "stk"  → may map to "stk", "stickers/search", etc.
 */
export type AppCommandType = (typeof APP_COMMAND)[keyof typeof APP_COMMAND];

export const APP_COMMAND_FULL_NAME = {
	[APP_COMMAND.MEME]: 'meme',
	[APP_COMMAND.GIF]: 'gif',
	[APP_COMMAND.STICKER]: 'sticker',
} satisfies Record<AppCommandType, string>;

export type NormalizedImageData = {
	id: number;
	type: AppCommandType;
	title: string;
	width: number;
	height: number;
	previewUrl: string;
	displayUrl: string;
	highResUrl: string;
	format: FileFormatType;
};

export type SearchProvider = {
	search: (resolvedCommand: AppCommandType, query: string) => Promise<NormalizedImageData[]>;
};
