module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "require-jsdoc": "off",
    "no-invalid-this": "off",
    "max-len": "off",
    "object-curly-spacing": ["error", "always"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
