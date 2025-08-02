import pluginJs from "@eslint/js";
import prettier from "eslint-config-prettier";
import pluginSvelte from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".svelte-kit/",
      "build/",
      "eslint.config.js",
      "tailwind.config.js"
    ]
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
        extraFileExtensions: [".svelte"]
      }
    }
  },
  {
    rules: {
      "svelte/no-inner-declarations": "off"
    }
  }
];
