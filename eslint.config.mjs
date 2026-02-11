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
];

eslintConfig.push({
  rules: {
    // untuk menangani dependecies yang sekiranya tidak dibutuhkan
    "react-hooks/exhautive-deps": "off",
    // komponen jauh lebih unique, beberapa fitur dari shadcn ui terkadang ada hal hala beberapa yang mengganggu kalau mengaktifkan jsx-key
    "react/jsx-key": "off",
    // tidak memakakai type any pada typescript sebenarnya cuma untuk midtrans tapi aku nonaktifkan
    "@typescript-eslint/no-explicit-any": "off",
    // dimatikan agar bisa menghilangkan sesuatu dari sebuiah objek
    "typescript-eslint/no-unused-vars": "off",
  },
});

export default eslintConfig;
