// eslint.config.js
import eslint from '@eslint/js'
import tseslint from "typescript-eslint"
import stylistic from '@stylistic/eslint-plugin'
import react from '@eslint-react/eslint-plugin'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.recommended,
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
            ],
            "object-curly-spacing": ["error", "always"],
            "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off"
        }
    }
)