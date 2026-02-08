import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  {
    ignores: ["eslint.config.mjs"],
  },
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier
      "prettier/prettier": "warn",

      // TypeScript specific
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/array-type": ["warn", { default: "array-simple" }],

      // React/Next.js specific
      "react/jsx-curly-brace-presence": [
        "warn",
        { props: "never", children: "never" },
      ],
      "react/self-closing-comp": "warn",
      "react-hooks/exhaustive-deps": "warn",

      // General best practices
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
      "object-shorthand": ["warn", "always"],
      "prefer-template": "warn",
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },
  prettierConfig,
]);

export default eslintConfig;
