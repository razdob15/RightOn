import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import json from '@eslint/json';
import { defineConfig } from 'eslint/config';
import pluginUnicorn from 'eslint-plugin-unicorn';

export default defineConfig([
  {
    ignores: ['dist', '**/*.json', '**/*.jsonc'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      unicorn: pluginUnicorn,
    },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginReactRefresh.configs.vite.rules,
      ...pluginUnicorn.configs.recommended.rules,
      'react/jsx-curly-brace-presence': ['error', { props: 'never' }],
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'unicorn/filename-case': 'off', // Too aggressive for existing project
      'unicorn/prevent-abbreviations': 'off', // Too aggressive for existing project
      'unicorn/no-null': 'off', // Allow null usage
      'unicorn/no-array-reduce': 'off', // Allow reduce usage
      'unicorn/no-abusive-eslint-disable': 'off', // Allow eslint-disable
      'unicorn/no-nested-ternary': 'off', // Allow nested ternary
      'unicorn/no-instanceof-builtins': 'off', // Allow instanceof
      'unicorn/no-lonely-if': 'off', // Allow lonely if
      'unicorn/switch-case-braces': 'off', // Allow switch without braces
      'unicorn/prefer-number-properties': 'off', // Allow parseInt
      'unicorn/prefer-query-selector': 'off', // Allow getElementById
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
