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
        project: './tsconfig?(.base).json',
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
        'array-element-newline': 0,
        'canonical/import-specifier-newline': 0,
        '@typescript-eslint/no-extra-parens': 0,
        'object-property-newline': 0,
        '@typescript-eslint/padding-line-between-statements': 0,
        'unicorn/no-abusive-eslint-disable': 0,
        'eslint-comments/no-unlimited-disable': 0,
        '@typescript-eslint/no-invalid-void-type': 0,
        '@typescript-eslint/no-floating-promises': 0,
        'unicorn/no-object-as-default-parameter': 0,
        'unicorn/no-array-reduce': 0,
        'node/no-process-env': 0,
      },
    },
    {
      extends: [
        'canonical/jest',
      ],
      files: '*.test.{ts,tsx}',
      parserOptions: {
        project: './tsconfig?(.base).json',
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
