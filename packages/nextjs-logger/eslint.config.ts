import * as path from "node:path"
import * as process from "node:process"

import { includeIgnoreFile } from "@eslint/compat"
import eslint from "@eslint/js"
import importPlugin from "eslint-plugin-import"
import prettier from "eslint-plugin-prettier/recommended"
import tsEslint from "typescript-eslint"

import prettierConfig from "./.prettierrc.json"

const gitIgnorePath = path.resolve(__dirname, ".gitignore")

export default tsEslint.config(
  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettier,
  ...tsEslint.configs.strictTypeChecked,
  ...tsEslint.configs.stylisticTypeChecked,

  {
    files: ["**/*.ts"],
  },
  includeIgnoreFile(gitIgnorePath),

  {
    languageOptions: {
      parserOptions: {
        // Enables project-specific TypeScript settings using `tsconfig.json`
        project: true,
        // Sets the root directory for TypeScript configuration
        tsconfigRootDir: import.meta.dirname,
      },
    },

    settings: {
      "import/resolver": {
        // Enables resolving TypeScript paths
        typescript: true,
        // Enables resolving Node.js modules
        node: true,
      },
    },

    rules: {
      "prettier/prettier": ["error", prettierConfig],

      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-alert": process.env.NODE_ENV === "production" ? "error" : "off",

      // Enforces Unix-style line endings for cross-platform consistency.
      // Helps avoid issues with line endings when collaborating across different operating systems.
      "linebreak-style": ["error", "unix"],

      // Enforces consistent use of double quotes for strings.
      // Improves readability and ensures style consistency across the codebase.
      quotes: ["error", "double"],

      // Enforces quotes around object properties only when necessary.
      // Reduces unnecessary quotes, improving code clarity.
      "quote-props": ["error", "as-needed"],

      // Enforces the omission of semicolons where optional.
      // Aligns with modern JavaScript style conventions and reduces unnecessary syntax.
      semi: ["error", "never"],

      // Requires the use of strict equality (`===` and `!==`) over abstract equality (`==` and `!=`).
      // Prevents type coercion issues.
      eqeqeq: "error",

      // Enforces the use of camelCase for variable and function names.
      // Ensures consistency in naming conventions, while allowing non-camelCase for object properties.
      camelcase: ["error", { properties: "never" }],

      // Requires the use of `const` for variables that are not reassigned.
      // Promotes immutability and reduces the risk of accidental reassignments.
      "prefer-const": "error",

      // Disallows multiple spaces except in specific scenarios like imports/exports.
      // Improves readability and avoids formatting inconsistencies.
      "no-multi-spaces": [
        2,
        {
          exceptions: {
            ImportDeclaration: true, // Allows multiple spaces in import declarations.
            ExportNamedDeclaration: true, // Allows multiple spaces in export declarations.
          },
        },
      ],

      // Encourages the use of arrow functions for callbacks.
      // Improves readability and prevents `this` binding issues.
      "prefer-arrow-callback": "error",

      // Encourages the use of template literals instead of string concatenation for building strings.
      // Improves readability and reduces errors.
      "prefer-template": "error",

      // Enforces consistent indentation with 2 spaces.
      // Excludes certain syntax elements like JSX attributes and property definitions for better alignment.
      indent: [
        "error",
        2,
        {
          ignoredNodes: ["JSXAttribute", "PropertyDefinition"], // Ignores indentation for JSX attributes and property definitions.
        },
      ],

      // Enforces consistent spacing before function parentheses.
      // Requires no space before parentheses for anonymous and named functions, but enforces a space before async arrow function parentheses.
      "space-before-function-paren": [
        "error",
        {
          anonymous: "never", // No space before anonymous function parentheses.
          named: "never", // No space before named function parentheses.
          asyncArrow: "always", // Space required before async arrow function parentheses.
        },
      ],

      // Enforces consistent spacing after comment markers.
      // Requires a space after `//` for line comments, but allows exceptions for `-` and `*`.
      // For block comments, requires a space after `!` and allows exceptions for `*` with balanced block comments.
      "spaced-comment": [
        "error",
        "always",
        {
          line: {
            markers: ["/"], // Space required after line comment markers.
            exceptions: ["-", "*"], // No space after `-` and `*` markers in line comments.
          },
          block: {
            markers: ["!"], // Space required after `!` in block comments.
            exceptions: ["*"], // No space after `*` in block comments.
            balanced: true, // Ensures block comments are balanced.
          },
        },
      ],

      // Enforces trailing commas in multiline constructs for better version control diffs.
      // Requires trailing commas in multiline code structures.
      "comma-dangle": ["error", "always-multiline"],

      // Enforces no duplicate imports in a file.
      // Allows inline imports and considers query strings to manage import uniqueness.
      "no-duplicate-imports": "off", // we will use import/no-duplicates instead
      "import/no-duplicates": [
        "error",
        {
          "prefer-inline": true, // Prefers inlined imports over separate import statements.
          considerQueryString: true, // Considers query strings when checking for duplicate imports.
        },
      ],

      // Enforces the default export in modules to be correctly imported and handled.
      "import/default": "error",

      // Disables the rule for managing namespace imports. We handle them separately.
      "import/namespace": "off",

      // Enforces a consistent and organized order for import statements, categorizing them into predefined groups.
      // This improves readability and maintainability of the import structure.
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          alphabetize: {
            order: "asc", // Sort imports alphabetically for consistency
            caseInsensitive: true, // Make the sort order case-insensitive
          },
          "newlines-between": "always", // Ensure there is a newline between different import groups
        },
      ],

      // Enforces a newline after the last import statement for cleaner and more readable code.
      "import/newline-after-import": "error",

      // Disallows circular dependencies, which can cause issues with module resolution and application stability.
      "import/no-cycle": "error",

      // Ensures all imported modules can be resolved, preventing potential issues from missing or incorrect imports.
      "import/no-unresolved": "error",

      // Prevents importing named exports as default, which can cause confusion and incorrect usage.
      "import/no-named-as-default-member": "error",

      // Prevents naming default exports in a way that could cause conflicts with named exports in the same module.
      "import/no-named-as-default": "error",

      // Disallows unused variables to maintain clean code, while allowing variables prefixed with "_" (typically for unused arguments).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_", // Allow unused arguments with a leading underscore.
          ignoreRestSiblings: true, // Allows destructuring without enforcing the use of all properties.
        },
      ],

      // Enforces no variable shadowing within the same scope to avoid confusion and errors in variable scoping.
      "no-shadow": "off", // using @typescript-eslint/no-shadow
      "@typescript-eslint/no-shadow": "error",

      // Enforces the prohibition of empty functions except for private constructors to ensure meaningful function implementations.
      "no-empty-function": "off", // we will use @typescript-eslint/no-empty-function instead
      "@typescript-eslint/no-empty-function": [
        "error",
        {
          allow: ["private-constructors"], // Allow empty private constructors
        },
      ],

      // Enforces restrictions on TypeScript directive comments to ensure they are used properly and with sufficient context.
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description", // Allows `ts-expect-error` only if a description is provided.
          minimumDescriptionLength: 10, // Minimum description length for `ts-expect-error` to ensure sufficient explanation.
          "ts-ignore": true, // Allows `ts-ignore`, but can be used with caution.
          "ts-nocheck": true, // Allows `ts-nocheck`, but should be used carefully.
          "ts-check": false, // Disallows `ts-check` to avoid unnecessary type checking in JS files.
        },
      ],

      // Prefers the use of optional chaining (`?.`) over complex conditionals to check for nullish or undefined values.
      // Improves code readability.
      "@typescript-eslint/prefer-optional-chain": "error",

      // Encourages using the `??` operator instead of `||` for default values,
      // ensuring proper handling of `null` and `undefined` without false positives.
      "@typescript-eslint/prefer-nullish-coalescing": "error",

      // Enforces consistent usage of type imports to improve readability and maintainability of TypeScript code.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports", // Enforces the use of `import type` for type imports.
          fixStyle: "inline-type-imports", // Enforces inline type imports rather than separate `type` imports.
        },
      ],

      // Enforces consistent export of types to improve maintainability and prevent misuse.
      "@typescript-eslint/consistent-type-exports": "error",

      // Disables rule for consistent type definitions, allowing flexibility in how types are defined.
      "@typescript-eslint/consistent-type-definitions": "off",

      // Prevents the side effect of importing types to ensure type imports are purely for type checking.
      "@typescript-eslint/no-import-type-side-effects": "error",

      // Ensures methods are properly bound to avoid issues with `this` context in TypeScript.
      "@typescript-eslint/unbound-method": [
        "error",
        {
          ignoreStatic: true, // Allows static methods to be exempt from this rule.
        },
      ],

      // Restricts the use of certain expressions inside template literals to ensure type safety.
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true, // Allows numbers in template literals.
          allowBoolean: true, // Allows booleans in template literals.
          allowAny: true, // Allows any type in template literals.
          allowNever: true, // Allows never type in template literals.
          allowNullish: true, // Allows null and undefined in template literals.
        },
      ],

      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            arguments: false,
            attributes: false,
          },
        },
      ],

      // Enforces explicit return types on functions, except for simple expressions.
      // Helps improve code readability and maintainability.
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
        },
      ],

      // Disallows the use of the 'any' type in TypeScript to ensure more specific typing.
      "@typescript-eslint/no-explicit-any": [
        "error",
        {
          ignoreRestArgs: false, // Enforces explicit types for rest arguments.
        },
      ],

      // Ensures that promises are properly handled with `.then`, `.catch`, or `await`.
      // Prevents unhandled promise rejections.
      "@typescript-eslint/no-floating-promises": "error",

      // Requires boolean expressions in conditionals to be strictly typed as `boolean`.
      // Disallows relying on type coercion for non-boolean values.
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowNumber: false,
          allowString: false,
        },
      ],

      // Disallows explicitly specifying types that can be inferred by TypeScript.
      // Reduces redundant code.
      "@typescript-eslint/no-inferrable-types": "error",

      // Enforces the removal of unnecessary conditions in TypeScript, improving code clarity and safety.
      "@typescript-eslint/no-unnecessary-condition": "error",

      // Encourages the use of 'readonly' for variables that should not be reassigned, ensuring immutability.
      "@typescript-eslint/prefer-readonly": "error",

      // Disallows the use of the `!` non-null assertion operator.
      // This prevents assuming a value is non-null or non-undefined without proper checks.
      "@typescript-eslint/no-non-null-assertion": "error",

      // Disallows passing unsafe values as arguments to functions that require stricter types.
      // Helps ensure type safety in function calls.
      "@typescript-eslint/no-unsafe-argument": "error",

      // Disallows assigning values to variables or properties of unknown or `any` types.
      // Ensures assignments are safe and type-checked.
      "@typescript-eslint/no-unsafe-assignment": "error",

      // Disallows calling values with types that are either unknown or `any`.
      // Helps avoid runtime errors due to unsafe calls.
      "@typescript-eslint/no-unsafe-call": "error",

      // Disallows accessing members of objects with unknown or `any` types.
      // Ensures safer member access and avoids potential runtime issues.
      "@typescript-eslint/no-unsafe-member-access": "error",

      // Disallows returning values from functions that have an unknown or `any` type.
      // Enforces safer return type handling.
      "@typescript-eslint/no-unsafe-return": "error",

      // Disallows using type assertions (`as` or angle-bracket syntax) on unknown or `any` types.
      // Encourages using proper type checks or guards.
      "@typescript-eslint/no-unsafe-type-assertion": "error",

      // Disallows the use of `for-in` loops over arrays, as it iterates over keys instead of values.
      // Encourages safer alternatives like `for-of`.
      "@typescript-eslint/no-for-in-array": "error",

      // Encourages using `for-of` loops over standard `for` loops when iterating through arrays.
      // This improves readability and ensures proper type inference.
      "@typescript-eslint/prefer-for-of": "error",

      // Restricts the use of the `+` operator to only numbers or strings.
      // Prevents unintended behavior caused by type coercion in other data types.
      "@typescript-eslint/restrict-plus-operands": [
        "error",
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumberAndString: false,
          allowRegExp: false,
        },
      ],

      // Enforces the use of `unknown` for the variable in `catch` clauses instead of `any`.
      // This ensures explicit type-checking before using the caught error.
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",
    },
  },
)
