module.exports = {
  extends: [
    'canonical',
  ],
  overrides: [
    {
      extends: [
        'canonical/typescript',
        'canonical/node',
      ],
      files: '*.ts',
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        'import/extensions': 'off',
        'canonical/filename-match-exported': 'off',
        'no-console': 'off',
        'quotes': ['error', 'single', { avoidEscape: true }],
        '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
        'canonical/filename-match-regex': [2, '^[a-z.]+([A-Z][a-z.]+)*$', true]
      },
    },
    {
      extends: [
        'canonical/jest',
      ],
      files: '*.test.{ts,tsx}',
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    {
      extends: [
        'canonical/json',
      ],
      files: '*.json',
    },
    {
      extends: [
        'canonical/yaml',
      ],
      files: '*.yaml',
    },
  ],
  root: true,
  ignorePatterns: ['.eslintrc.js'],
};
