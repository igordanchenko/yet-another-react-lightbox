import fs from "fs";
import path from "path";
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";

const pluginsRoot = "src/plugins";

function listPlugins() {
  const root = path.resolve(pluginsRoot);
  return fs
    .readdirSync(root)
    .filter(
      (file) =>
        fs.statSync(path.resolve(root, file)).isDirectory() && fs.existsSync(path.resolve(root, file, "index.ts")),
    );
}

export default [
  [
    typescript({
      include: ["src/**/*"],
      compilerOptions: { removeComments: true },
    }),
  ],
  [dts()],
].map((plugins) => ({
  input: {
    index: "src/index.ts",
    types: "src/types.ts",
    "plugins/index": `${pluginsRoot}/index.ts`,
    ...Object.fromEntries(
      listPlugins().map((plugin) => [`plugins/${plugin}/index`, `${pluginsRoot}/${plugin}/index.ts`]),
    ),
  },
  output: [
    {
      dir: "dist",
      format: "esm",
      minifyInternalExports: false,
    },
  ],
  external: ["react", "react-dom"],
  preserveEntrySignatures: "allow-extension",
  treeshake: false,
  plugins,
}));
