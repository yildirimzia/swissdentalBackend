import nextLintConfig from "eslint-config-next";

export default [
  ...nextLintConfig(),
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },
];
