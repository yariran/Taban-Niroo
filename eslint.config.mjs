import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** @type {import('eslint').Linter.Config[]} */
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");
/** @type {import('eslint').Linter.Config[]} */
const nextTypescript = require("eslint-config-next/typescript");

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Legitimate patterns: media-query hydration, IntersectionObserver reveal, layout prep.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
