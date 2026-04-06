import { z } from 'zod';

const ImageVariantSchema = z.looseObject({
	url: z.url(),
	width: z.number(),
	height: z.number(),
});

const PngResolutionSchema = z.looseObject({
	md: z.looseObject({
		png: ImageVariantSchema,
	}),
	hd: z.looseObject({
		png: ImageVariantSchema,
	}),
});

const GifResolutionSchema = z.looseObject({
	md: z.looseObject({
		gif: ImageVariantSchema,
	}),
	hd: z.looseObject({
		gif: ImageVariantSchema,
	}),
});

const BaseImageSchema = z.looseObject({
	id: z.number(),
	blur_preview: z.string(),
	title: z.string(),
});

const StaticMemeSchema = BaseImageSchema.extend({
	type: z.literal('static-meme'),
	file: PngResolutionSchema,
});

const GifSchema = BaseImageSchema.extend({
	type: z.literal('gif'),
	file: GifResolutionSchema,
});

const RawKlipyImageDataSchema = z.discriminatedUnion('type', [StaticMemeSchema, GifSchema]);

export const RawKlipySearchResponseSchema = z.looseObject({
	data: z.looseObject({
		data: z.array(RawKlipyImageDataSchema),
	}),
});

export type RawKlipyImageData = z.infer<typeof RawKlipyImageDataSchema>;

export type RawKlipySearchResponse = z.infer<typeof RawKlipySearchResponseSchema>;

export type ImageVariant = z.infer<typeof ImageVariantSchema>;

export const VALID_COMMANDS = { MEME: 'meme', GIF: 'gif' } as const;

export type CommandType = (typeof VALID_COMMANDS)[keyof typeof VALID_COMMANDS];

export type FileFormatType = 'png' | 'gif';

export type NormalizedSearchResult = {
	id: number;
	type: CommandType;
	width: number;
	height: number;
	previewUrl: string;
	displayUrl: string;
	originalUrl: string;
	blurPreview: string;
	format: FileFormatType;
};
