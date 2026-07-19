export type FileFormatType = 'webp' | 'gif';

/**
 * These are the only VALID app-level commands that the system recognizes. Each command represents
 * a distinct category of search and is independent of any provider-specific implementation.
 */
export const APP_COMMAND = {
	MEME: 'm',
	GIF: 'g',
	STICKER: 's',
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
 * - "m" → may map to "m", "static_meme", etc.
 * - "g"  → may map to "g", "gifs/search", etc.
 * - "s"  → may map to "s", "stickers/search", etc.
 */
export type AppCommandType = (typeof APP_COMMAND)[keyof typeof APP_COMMAND];

/**
 * User-friendly labels for each supported app command.
 *
 * This mapping preserves the normalized internal command values
 * while exposing a stable, human-readable name for UI rendering.
 */
export const APP_COMMAND_FULL_NAME = {
	[APP_COMMAND.MEME]: 'meme',
	[APP_COMMAND.GIF]: 'gif',
	[APP_COMMAND.STICKER]: 'sticker',
} as const satisfies Record<AppCommandType, string>;

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
