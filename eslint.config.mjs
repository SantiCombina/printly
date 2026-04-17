import nextConfig from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-plugin-prettier';

const eslintConfig = [
  {
    ignores: ['src/app/(payload)/**'],
  },

  ...nextConfig,
  ...nextCoreWebVitals,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          endOfLine: 'auto',
          printWidth: 120,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          trailingComma: 'all',
        },
      ],

      'no-unused-expressions': ['error', { allowShortCircuit: true }],
      'no-param-reassign': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      'no-alert': 'off',
      'no-use-before-define': 'off',
      'no-underscore-dangle': 'off',
      'func-names': 'off',
      'no-nested-ternary': 'off',

      'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/button-has-type': 'warn',
      'react/jsx-pascal-case': 'error',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-no-duplicate-props': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',

      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/label-has-associated-control': 'off',

      'import/no-cycle': 'off',
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          pathGroups: [
            { pattern: '@/**', group: 'internal', position: 'before' },
            { pattern: './**', group: 'sibling', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/extensions': ['error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' }],

      '@next/next/no-img-element': 'off',

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
];

export default eslintConfig;
