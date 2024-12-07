import { defineConfig } from "tsup"

export default defineConfig({
  // entry file
  entry: ["src/index.ts"],
  // output directory
  outDir: "dist",
  // commonjs, esmodule and umd formats
  format: ["esm"],
  // target the latest ES features
  target: "esnext",
  // minify the output
  minify: true,
  // generate typescript declarations
  dts: true,
  // include sourcemaps
  sourcemap: false,
  // clean output directory before build
  clean: true,
  // explicitly enable tree shaking
  treeshake: true,
})
