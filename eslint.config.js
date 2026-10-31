import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {ignores: ['node_modules/**', '.cache/**', 'android/**', 'assets/**']},
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {ecmaFeatures: {jsx: true}},
      globals: {...globals.node, ...globals.jest, __DEV__: 'readonly'},
    },
  },
);
