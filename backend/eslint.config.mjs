// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'dist/**', 'node_modules/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  
  // Apply type-checked rules only to non-test source files
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['src/**/*.ts'],
    ignores: ['**/*.spec.ts', 'test/**/*.ts'],
  })),

  // Configure parser only for files we want to type check
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.spec.ts', 'test/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
    },
  },
  
  // Non-type-aware custom rules (can run on all files)
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // Type-aware custom rules (only run on non-test source files)
  {
    files: ['src/**/*.ts'],
    ignores: ['**/*.spec.ts', 'test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
    },
  },
);
