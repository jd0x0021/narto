export type FileFormatType = 'png' | 'gif';

/**
 * These are the only VALID app-level commands that the system recognizes. Each command represents
 * a distinct category of search and is independent of any provider-specific implementation.
 */
export const AppCommand = {
	Meme: 'meme',
	Gif: 'gif',
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
 */
export type AppCommandType = (typeof AppCommand)[keyof typeof AppCommand];

export type NormalizedSearchResult<TCommand extends string = string> = {
	id: number;
	type: TCommand;
	title: string;
	width: number;
	height: number;
	previewUrl: string;
	displayUrl: string;
	originalUrl: string;
	blurPreview: string;
	format: FileFormatType;
};

export type SearchProvider = {
	search: (resolvedCommand: AppCommandType, query: string) => Promise<NormalizedSearchResult[]>;
};
