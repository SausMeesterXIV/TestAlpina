import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules/**"]
  },
  {
      plugins: {
          "@stylistic": stylistic
      },

      languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      globals: {
        browser: true,
        es2021: true,
        node: true,
        mocha: true
      }
    },

    rules: {
      "no-alert": "error",
      "no-eval": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.object.name='document'][callee.property.name='getElementById']",
          message: "Use of getElementById is not allowed."
        },
        {
          selector: "CallExpression[callee.object.name='document'][callee.property.name='getElementsByClassName']",
          message: "Use of getElementsByClassName is not allowed."
        },
        {
          selector: "CallExpression[callee.object.name='document'][callee.property.name='getElementsByTagName']",
          message: "Use of getElementsByTagName is not allowed."
        }
        ],
        "@stylistic/semi": ["error", "always"],
        "@stylistic/quotes": ["error", "double"],
        "@stylistic/brace-style": ["error", "1tbs"],
        "camelcase": ["error", {properties: "always", ignoreGlobals: true}],
        "prefer-template": "error",
        "no-template-curly-in-string": "error",
        "no-unmodified-loop-condition": "error",
        "no-unreachable-loop": "error",
        "no-var": "error",
        "no-shadow": "error",
        "@stylistic/space-infix-ops": "error",
        "prefer-const": ["error", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": false
        }]
    }
  }
];