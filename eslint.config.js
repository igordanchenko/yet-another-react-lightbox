import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginJsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig(
  globalIgnores(["coverage", "**/dist"]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  // eslintPluginReact.configs.flat["jsx-runtime"],
  eslintPluginJsxA11y.flatConfigs.recommended,
  eslintConfigPrettier,
  {
    settings: { react: { version: "detect" } },
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": eslintPluginReactHooks },
    rules: {
      "no-console": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["fixup-dist.js"],
    languageOptions: { globals: globals.node },
  },
);
