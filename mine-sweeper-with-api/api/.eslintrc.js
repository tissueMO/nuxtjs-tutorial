module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    'ecmaVersion': 2019,
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    'semi': ['error', 'always'],
    'semi-spacing': ['error', { 'after': true, 'before': false }],
    'semi-style': ['error', 'last'],
    'comma-dangle': ['error', 'only-multiline'],
    'no-extra-semi': 'error',
    'no-unexpected-multiline': 'error',
    'no-unreachable': 'error',
  },
};
