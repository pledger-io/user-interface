// eslint.config.js
import eslint from '@eslint/js'
import tseslint from "typescript-eslint"
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    stylistic.configs['disable-legacy'],
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                }
            ]
        }
    }
)