import typescript from "rollup-plugin-typescript"
import sourceMaps from "rollup-plugin-sourcemaps"

module.exports = {
  input: "./src/index.ts",
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript")
    }),
    sourceMaps()
  ],
  output: [
    {
      format: "cjs",
      file: "dist/printTree.cjs.js"
    },
    {
      format: "es",
      file: "dist/printTree.esm.js"
    }
  ],
  external: ['canvas', 'terminal-image']
}