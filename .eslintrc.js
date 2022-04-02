module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off"
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ]
}
