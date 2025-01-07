import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["**/*.js", "lib/FirstExample/first-example.function.ts"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
