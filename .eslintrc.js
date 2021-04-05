module.exports = {
  extends: ['airbnb-typescript'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    useJSXTextNode: true,
    project: './tsconfig.json'
  },
  rules: {
    'no-nested-ternary': 'off',
    'global-require': 'off'
  }
}