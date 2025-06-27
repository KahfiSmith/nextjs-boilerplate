import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript"
  ),
  {
    rules: {
      // Custom rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error",
      "no-console": "warn",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // Ignore patterns
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
    ],
  },
];

export default eslintConfig;