import type { Config } from 'tailwindcss';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'narto-bg': '#0f1011',
				'narto-panel': '#151518',
				'narto-input-bg': '#1e1f24',
				'narto-accent': '#ff6b00',
				'narto-text': '#fcfcfc',
				'narto-muted': '#6b6e76',
				'narto-border': '#292a2d',
			},
			borderRadius: {
				narto: '14px',
				'narto-sm': '8px',
				'narto-full': '9999px',
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
		},
	},
	plugins: [],
} satisfies Config;
