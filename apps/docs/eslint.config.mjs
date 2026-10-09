import tseslint from "typescript-eslint"
import blankui from "@blankui/eslint-plugin"

export default tseslint.config(
  { ignores: [".next/**", "public/**", "next-env.d.ts"] },
  ...tseslint.configs.recommended,
  ...blankui.configs.recommended,
)
