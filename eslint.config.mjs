import { readFileSync } from "node:fs";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

// unplugin-auto-import が生成する globals（vue / vue-router / composables）
let autoImportGlobals = {};
try {
  autoImportGlobals = JSON.parse(
    readFileSync(new URL("./.eslintrc-auto-import.json", import.meta.url), "utf8"),
  ).globals;
} catch {
  // 未生成（vite を一度も実行していない）場合は空でよい
}

export default tseslint.config(
  {
    ignores: [
      "dist",
      "theme/**",
      "node_modules",
      ".nuxt",
      ".output",
      "auto-imports.d.ts",
      "components.d.ts",
      ".eslintrc-auto-import.json",
      "public/data/note-articles.json",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.{js,mjs,ts,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoImportGlobals,
      },
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
);
