import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {ignores: ['node_modules/**', '.cache/**', 'android/**', 'assets/**']},
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {argsIgnorePattern: '^_', ignoreRestSiblings: true},
      ],
    },
    languageOptions: {
      parserOptions: {ecmaFeatures: {jsx: true}},
      globals: {
        ...globals['shared-node-browser'],
        __DEV__: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
      },
    },
  },
  {
    files: ['*.config.js', 'scripts/*.mjs'],
    languageOptions: {globals: globals.node},
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    languageOptions: {globals: {...globals.node, ...globals.jest}},
  },
);
