/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
	readonly VITE_KLIPY_BASE_URL: string;
	readonly VITE_KLIPY_API_KEY: string;
	readonly VITE_RESULTS_PER_PAGE: string;
	readonly VITE_CONTENT_FILTER: string;
}
