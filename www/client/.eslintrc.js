module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "react/no-unknown-property": ["error", { ignore: ["class"] }],
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-function": 0,
  },
  settings: {
    react: {
      pragma: "h",
      version: "detect"
    },
  },
};
