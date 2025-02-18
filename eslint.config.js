import { defineConfig } from 'eslint-define-config';
import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';

export default defineConfig([
  {
    // files: ['*.ts'],
		files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsParser, // Folosește parserul TypeScript
      parserOptions: {
        project: './tsconfig.json', // Calea către fișierul tsconfig
        ecmaVersion: 2020, // Specifică versiunea ECMAScript
        sourceType: 'module', // Permite importurile
      },
    },
    plugins: {
      '@angular-eslint': angularEslintPlugin,
      '@typescript-eslint': tsEslintPlugin, // Adaugă plugin-ul TypeScript
    },
    rules: {
      '@angular-eslint/component-selector': ['error', {
        type: 'element',
        prefix: 'app',
        style: 'kebab-case',
      }],
      '@typescript-eslint/no-explicit-any': 'warn', // Exemplu de regulă TypeScript
    },
  },
  // {
	// 	// files: ['*.html'],
  //   files: ['src/**/*.html'],
  //   plugins: ['@angular-eslint'],
  //   rules: {
  //     '@angular-eslint/template/eqeqeq': 'warn',
  //   },
  // },
]);
