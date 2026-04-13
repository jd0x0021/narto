import type {
	ImageVariant,
	RawKlipyImageData,
	RawKlipySearchResponse,
} from '@/services/providers/klipy/klipy.types';
import { RawKlipySearchResponseSchema } from '@/services/providers/klipy/klipy.types';
import {
	SearchProviderError,
	SearchProviderHttpError,
	SearchProviderNetworkError,
	SearchProviderSchemaError,
} from '@/services/providers/searchProvider.errors';
import type {
	AppCommandType,
	FileFormatType,
	NormalizedSearchResult,
	SearchProvider,
} from '@/services/providers/searchProvider.types';

const KLIPY_BASE_URL = import.meta.env.VITE_KLIPY_BASE_URL;
const API_KEY = import.meta.env.VITE_KLIPY_API_KEY;
const REQUESTED_PAGE_NUMBER = import.meta.env.VITE_KLIPY_REQUESTED_PAGE_NUMBER;
const RESULTS_PER_PAGE = import.meta.env.VITE_KLIPY_RESULTS_PER_PAGE;
const CONTENT_FILTER = import.meta.env.VITE_KLIPY_CONTENT_FILTER;

/**
 * Defines the mapping from app-level commands to Klipy API endpoints. The keys are app-level commands
 * (AppCommandType) and the values are the corresponding Klipy API endpoint paths.
 *
 * The `satisfies` clause ensures that all AppCommandType values are covered by this mapping,
 * providing type safety and preventing runtime errors due to missing endpoints.
 *
 * If Klipy changes its API endpoints (e.g. "static-meme" → "static_meme"),
 * only this mapping needs to be updated.
 */
export const klipyEndpoints = {
	meme: 'static-memes/search',
	gif: 'gifs/search',
} as const satisfies Record<AppCommandType, string>;

export const klipyClient: SearchProvider = {
	async search(resolvedCommand: AppCommandType, query: string) {
		const customerId = await getOrCreateCustomerId();
		const locale = navigator.language || 'en-US';
		const endpoint = klipyEndpoints[resolvedCommand];

		const url = new URL(`${KLIPY_BASE_URL}/api/v1/${API_KEY}/${endpoint}`);
		url.searchParams.set('q', query);
		url.searchParams.set('page', REQUESTED_PAGE_NUMBER);
		url.searchParams.set('per_page', RESULTS_PER_PAGE);
		url.searchParams.set('customer_id', customerId);
		url.searchParams.set('locale', locale);
		url.searchParams.set('content_filter', CONTENT_FILTER);

		try {
			const res = await fetch(url.toString());

			if (!res.ok) {
				throw new SearchProviderHttpError(
					res.status,
					`HTTP ${res.status}: Klipy request failed.`,
				);
			}

			const parsedKlipyResponse = RawKlipySearchResponseSchema.safeParse(await res.json());

			if (!parsedKlipyResponse.success) {
				throw new SearchProviderSchemaError(
					res.status,
					`HTTP ${res.status}: Klipy returned an invalid response format.`,
				);
			}

			return normalizeKlipyResponse(parsedKlipyResponse.data);
		} catch (error) {
			if (error instanceof SearchProviderError) {
				throw error;
			}

			// native fetch failures (e.g. network issues) will be caught here
			throw new SearchProviderNetworkError(
				`Network error while fetching ${resolvedCommand}s from Klipy. Try again shortly.`,
			);
		}
	},
};

async function getOrCreateCustomerId(): Promise<string> {
	if (typeof chrome !== 'undefined') {
		const result = await chrome.storage.local.get('narto:customer_id');
		if (typeof result['narto:customer_id'] === 'string') {
			return result['narto:customer_id'];
		}
		const id = crypto.randomUUID();
		await chrome.storage.local.set({ 'narto:customer_id': id });
		return id;
	}

	let id = localStorage.getItem('narto:customer_id');
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem('narto:customer_id', id);
	}
	return id;
}

function normalizeKlipyResponse(responseData: RawKlipySearchResponse): NormalizedSearchResult[] {
	const data: RawKlipyImageData[] = responseData.data.data;

	return data.map((raw): NormalizedSearchResult => {
		const isGif = raw.type === 'gif';

		// file resolutions
		const md: ImageVariant = isGif ? raw.file.md.gif : raw.file.md.png;
		const hd: ImageVariant = isGif ? raw.file.hd.gif : raw.file.hd.png;

		const format: FileFormatType = isGif ? 'gif' : 'png';
		const type: AppCommandType = isGif ? 'gif' : 'meme';

		return {
			id: raw.id,
			type: type,
			width: md.width,
			height: md.height,
			previewUrl: md.url,
			displayUrl: md.url,
			originalUrl: hd.url,
			blurPreview: raw.blur_preview,
			format: format,
		};
	});
}
