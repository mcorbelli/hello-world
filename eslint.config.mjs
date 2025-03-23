import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

// https://tanstack.com/query/v5/docs/eslint/eslint-plugin-query#recommended-setup

import eslintPluginTanstack from "@tanstack/eslint-plugin-query";

// Reminder: Use the guide at https://github.com/prettier/eslint-plugin-prettier
// to properly integrate ESLint and Prettier. This ensures code formatting and
// linting rules work seamlessly together.

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  eslintPluginPrettierRecommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...eslintPluginTanstack.configs["flat/recommended"],
  {
    ignores: ["node_modules/", "components/ui/"],
  },
];

export default eslintConfig;
