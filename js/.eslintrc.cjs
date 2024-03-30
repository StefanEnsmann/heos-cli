module.exports = {
    ignorePatterns: [".eslintrc.cjs", "dist", "tsup.config.ts"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname
    },
    overrides: [
        {
            extends: ["plugin:@typescript-eslint/disable-type-checked"],
            files: ["example.js"]
        }
    ],
    plugins: ["@typescript-eslint"],
    env: {
        node: true
    }
};