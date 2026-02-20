import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/dist/**", "**/node_modules/**", "server/drizzle/**", "**/*.js", "**/*.d.ts"],
  },
  {
    files: ["client/src/**/*.ts"],
    languageOptions: {
      globals: {
        document: "readonly",
        fetch: "readonly",
        navigator: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        URLSearchParams: "readonly",
        console: "readonly",
        HTMLInputElement: "readonly",
        HTMLUListElement: "readonly",
        HTMLElement: "readonly",
        Node: "readonly",
      },
    },
  },
  {
    files: ["server/src/**/*.ts"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
  },
);
