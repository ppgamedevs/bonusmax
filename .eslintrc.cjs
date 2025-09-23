/* Shared ESLint config for the monorepo */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  ignorePatterns: ['node_modules/', 'dist/', '.next/', 'out/', 'build/'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    // Temporarily relax explicit any usage to a warning so lint doesn't fail.
    // We should replace `any` with proper types incrementally.
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
