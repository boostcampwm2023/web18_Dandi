module.exports = {
  extends:"../packages/eslint-config/.eslintrc.js",
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    'prettier/prettier': [
      'error',
      {
          endOfLine: 'auto',
      },
    ],
  },
};
