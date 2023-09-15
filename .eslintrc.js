module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir : __dirname, 
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'simple-import-sort',
    'unused-imports',
    'typescript-sort-keys',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'simple-import-sort/imports': 'error', // Import configuration for `eslint-plugin-simple-import-sort`,
    'simple-import-sort/exports': 'error', // Export configuration for `eslint-plugin-simple-import-sort`,
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
      },
    ],
    "typescript-sort-keys/interface": "error",
    "typescript-sort-keys/string-enum": "error",
    "sort-keys": ["warning", "asc", {"caseSensitive": true, "natural": false, "minKeys": 2}]
  },
};
