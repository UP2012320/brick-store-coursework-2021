module.exports = {
  extends: [
    '../.eslintrc.js',
  ],
  overrides: [
    {
      extends: [
        'canonical/node',
      ],
      files: '*.ts',
      parserOptions: {
        project: './tsconfig.json',
      },
    }
  ],
};
