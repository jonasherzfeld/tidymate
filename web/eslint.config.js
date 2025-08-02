import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginSvelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";
import svelteParser from "svelte-eslint-parser";

export default [
  {
    ignores: [".svelte-kit/", "build/"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginSvelte.configs["flat/recommended"],
  prettier,
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
    },
  },
  {
    rules: {
      "svelte/no-inner-declarations": "off",
    },
  },
];