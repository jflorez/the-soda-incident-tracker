module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: `./tsconfig.json`,
    },
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'google',
    ],
    rules: {
      'eqeqeq':'error',
      'require-jsdoc':'off',
      'max-len':'off',
      'no-throw-literal':'off',
      'indent':['error',4],
      'no-trailing-spaces':'off',
      'arrow-parens':'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-empty-pattern': 'off'
    }
  };