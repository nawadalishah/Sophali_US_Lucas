module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'airbnb-typescript',
  ],
  parserOptions: {
    project: './tsconfig.json', // Path to your tsconfig.json
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
    'react',
    'react-native',
    'import',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'prettier/prettier': ['warn', { usePrettierrc: true }],
    'no-unused-vars': 'error',
    'no-console': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'no-undef': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    'no-underscore-dangle': 'off',
    'array-callback-return': 'off',
    'no-plusplus': 'off',
    'react/prop-types': 'off',
    'no-nested-ternary': 'off',
    'import/prefer-default-export': 'off',
    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'import/no-cycle': [
      'error',
      {
        maxDepth: 10,
        ignoreExternal: true,
      },
    ],
    'react/no-unstable-nested-components': 'off',
    'react/prefer-stateless-function': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: false,
        allowUnboundThis: true,
      },
    ],
    'react/function-component-definition': [
      'off',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
        allowArrowFunctions: false,
      },
    ],
  },
};
