import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/util/index.ts",
  ],
  format: "esm",
  dts: true,
  splitting: false,
  // minify: true,
  clean: true
});