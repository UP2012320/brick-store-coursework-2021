module.exports = {
  extends: [
    'canonical',
  ],
  overrides: [
    {
      extends: [
        'canonical/typescript',
      ],
      files: '*.ts',
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        'import/extensions': 0,
        'canonical/filename-match-exported': 0,
        'no-console': 0,
        'quotes': [2, 'single', { avoidEscape: true }],
        '@typescript-eslint/quotes': [2, 'single', { avoidEscape: true }],
        'canonical/filename-match-regex': [2, '^[a-z.]+([A-Z][a-z.]+)*$', true],
        'object-curly-newline': [2, {
          "ImportDeclaration": "never",
        }],
        'object-curly-spacing': [2, 'never'],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        'arrow-body-style': [2, 'as-needed'],
        '@typescript-eslint/no-unused-vars': 1,
        'no-trailing-spaces': 1,
        'no-empty': 1,
        'id-length': 1,
        'unicorn/prevent-abbreviations': 1,
        'func-style': 0,
        'spaced-comment': 1,
        'array-bracket-newline': 0,
        'canonical/destructuring-property-newline': 0,
        'array-element-newline': 0
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
  ignorePatterns: ['.eslintrc.js'],
};
