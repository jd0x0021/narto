import type { Config } from 'tailwindcss';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'narto-main': '#111116',
				'narto-panel': '#151518',
				'narto-input': '#18181d',
				'narto-footer': '#070709',
				'narto-accent': '#ff6b00',
				'narto-text': '#fcfcfc',
				'narto-muted': '#71717a',
				'narto-border': '#292a2d',
			},
			borderRadius: {
				narto: '14px',
				'narto-sm': '8px',
				'narto-full': '9999px',
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
			},
		},
	},
	plugins: [],
} satisfies Config;
