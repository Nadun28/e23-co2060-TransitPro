import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist"], // cleaner than globalIgnores
  },
  {
    files: ["**/*.{js,jsx}"],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: "latest", // more modern (same effect)
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      // same logic, just clearer naming
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^[A-Z_]", // keep ignoring constants/components
          argsIgnorePattern: "^_",      // NEW: ignore unused function args (_)
        },
      ],

      // optional safe improvements (no behavior change)
      "no-console": "warn", // doesn't break anything
    },
  },
]);
