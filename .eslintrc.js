// .eslintrc.js
module.exports = {
  // Specifies the environments where your code will run.
  // 'browser' for client-side JavaScript (e.g., React apps).
  // 'node' is often included for ESLint configuration files themselves,
  // or if you have Node.js specific scripts in your project.
  env: {
    browser: true,
    node: true,
    es2021: true, // Enables parsing of ES2021 features
  },
  // Extends popular configurations.
  // - 'eslint:recommended': The basic recommended rules from ESLint.
  // - 'plugin:react/recommended': Recommended rules for React.
  // - 'plugin:react/jsx-runtime': Disables the "React must be in scope" rule
  //   for React 17+ projects using the new JSX transform.
  // - 'plugin:@typescript-eslint/recommended': Recommended rules for TypeScript.
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:@typescript-eslint/recommended',
  ],
  // Specifies the parser to use.
  // @typescript-eslint/parser is required for ESLint to understand TypeScript syntax.
  parser: '@typescript-eslint/parser',
  // Configuration options for the parser.
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // Enable JSX parsing
    },
    ecmaVersion: 'latest', // Use the latest ECMAScript standard
    sourceType: 'module', // Allow the use of imports
    // This setting is crucial for rules that require type information.
    // It tells @typescript-eslint/parser where your tsconfig.json is.
    // Adjust the path if your tsconfig.json is not in the same directory.
    project: './tsconfig.json',
  },
  // Specifies which ESLint plugins to use.
  // These plugins provide the rules and configurations used in 'extends'.
  plugins: ['react', '@typescript-eslint'],
  // Custom rules or overrides.
  // You can adjust these to your team's preferences.
  rules: {
    // Disable the base ESLint 'no-unused-vars' rule, as it can conflict
    // with TypeScript's type-aware linting.
    'no-unused-vars': 'off',
    // Enable the TypeScript-specific 'no-unused-vars' rule.
    // This rule is smarter and understands TypeScript types.
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Indentation: Enforce 2-space indentation.
    indent: ['error', 2, { SwitchCase: 1 }],

    // Quotes: Enforce single quotes for strings.
    quotes: ['error', 'single'],

    // Semicolons: Require semicolons at the end of statements.
    semi: ['error', 'always'],

    // React: Disable prop-types validation, as TypeScript handles type checking.
    'react/prop-types': 'off',

    // React: Require return types on functional components.
    // You might want to change this to 'off' or 'warn' if you prefer
    // to infer return types for simpler components.
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
      },
    ],

    // Disallow the use of the 'any' type.
    // Change to 'off' or 'warn' if you need more flexibility during development.
    '@typescript-eslint/no-explicit-any': 'warn',

    // Enforce consistent naming for type imports.
    // Useful for distinguishing types from regular imports.
    '@typescript-eslint/consistent-type-imports': 'error',
  },
  // Settings for plugins that require global configuration.
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
};
