import type { Config } from 'tailwindcss';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'narto-main': '#111116',
				'narto-panel': '#151518',
				'narto-pill': '#16161B',
				'narto-input': '#18181D',
				'narto-footer': '#070709',
				'narto-accent': '#FF6B00',
				'narto-gif': '#084572',
				'narto-stk': '#B6AA10',
				'narto-text': '#FCFCFC',
				'narto-muted': '#71717A',
				'narto-border': '#292A2D',
				'narto-loading': '#FDC601',
				'narto-success': '#10B981',
				'narto-error': '#EF4444',
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
			keyframes: {
				skeleton: {
					'0%': {
						transform: 'translateX(-150%)',
					},
					'100%': {
						transform: 'translateX(250%)',
					},
				},
				textWave: {
					'0%, 60%, 100%': {
						transform: 'translateY(0)',
					},
					'30%': {
						transform: 'translateY(-6px)',
					},
				},
			},
			animation: {
				skeleton: 'skeleton 1.5s ease-in-out infinite',
				'text-wave': 'textWave 1.2s ease-in-out infinite',
			},
		},
	},
	plugins: [],
} satisfies Config;
