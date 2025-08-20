module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  plugins: ["react", "react-hooks"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
  },
  overrides: [
    {
      files: ["**/*.jsx", "**/*.js"],
      rules: {}
    }
  ]
};
