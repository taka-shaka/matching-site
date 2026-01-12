import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // 本番ビルド時にanyを警告に変更（エラーではなく警告）
      "@typescript-eslint/no-explicit-any": "warn",
      // 未使用変数も警告に変更
      "@typescript-eslint/no-unused-vars": "warn",
      // imgタグの使用も警告に変更
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
