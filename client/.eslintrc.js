module.exports = {
  extends: [
    '../.eslintrc.js',
  ],
  overrides: [
    {
      extends: [
        'canonical/browser',
        'canonical/module',
      ],
      files: '*.ts',
      parserOptions: {
        project: './tsconfig.json',
      },
    }
  ],
  ignorePatterns: ['*.scss.d.ts', '*.d.ts'],
};
