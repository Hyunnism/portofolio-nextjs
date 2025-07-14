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
    rules: {
      // Opsional: peringatan jika pakai `any`
      "@typescript-eslint/no-explicit-any": "warn",

      // Opsional: biar variabel tak terpakai tidak error fatal
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Bisa nonaktifkan ini kalau tidak pakai Google Fonts default
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default eslintConfig;
