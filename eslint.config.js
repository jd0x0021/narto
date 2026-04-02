import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['dist', 'node_modules'],
	},

	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	react.configs.flat.recommended,
	reactHooks.configs.flat.recommended,
	reactRefresh.configs.vite,
	jsxA11y.flatConfigs.recommended,

	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				project: './tsconfig.app.json',
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			prettier: prettierPlugin,
			'simple-import-sort': simpleImportSort,
			'unused-imports': unusedImports,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
			'prettier/prettier': 'error',
			'unused-imports/no-unused-imports': 'error',
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},

	prettier,
];
