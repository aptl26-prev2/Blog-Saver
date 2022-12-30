module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    "jest": true
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 0,
    semi: 0,
    'comma-dangle': 0,
    'no-underscore-dangle': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'object-curly-newline': 0,
  },
};
