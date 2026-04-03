import type {
	CommandType,
	FileFormatType,
	ImageVariant,
	NormalizedSearchResult,
	RawKlipyImageData,
	RawKlipySearchResponse,
} from './types';
import { RawKlipySearchResponseSchema } from './types';

const KLIPY_BASE_URL = import.meta.env.VITE_KLIPY_BASE_URL;
const API_KEY = import.meta.env.VITE_KLIPY_API_KEY;
const RESULTS_PER_PAGE = import.meta.env.VITE_RESULTS_PER_PAGE;
const CONTENT_FILTER = import.meta.env.VITE_CONTENT_FILTER;

const ENDPOINT_MAP = new Map<CommandType, string>([
	['meme', '/static-memes/search'],
	['gif', '/gifs/search'],
]);

export async function fetchKlipy(
	resolvedCommand: CommandType,
	query: string,
	page = 1,
): Promise<NormalizedSearchResult[]> {
	const customerId = await getOrCreateCustomerId();
	const locale = navigator.language || 'en-US';
	const endpoint = ENDPOINT_MAP.get(resolvedCommand);

	const url = new URL(`${KLIPY_BASE_URL}/api/v1/${API_KEY}${endpoint}`);
	url.searchParams.set('q', query);
	url.searchParams.set('page', page.toString());
	url.searchParams.set('per_page', RESULTS_PER_PAGE);
	url.searchParams.set('customer_id', customerId);
	url.searchParams.set('locale', locale);
	url.searchParams.set('content_filter', CONTENT_FILTER);

	const res = await fetch(url.toString());

	if (!res.ok) {
		throw new Error('Klipy network error');
	}

	const parsedKlipyResponse = RawKlipySearchResponseSchema.safeParse(await res.json());

	if (!parsedKlipyResponse.success) {
		throw new Error('Klipy response validation error', parsedKlipyResponse.error);
	}

	return normalizeKlipyResponse(parsedKlipyResponse.data);
}

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
		const type: CommandType = isGif ? 'gif' : 'meme';

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
