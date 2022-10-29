import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
const plugins = [resolve(), commonjs(), typescript()];

const deps = [...Object.keys(pkg.dependencies)];
const external = (id) => deps.includes(id);

export default [
  {
    input: "./src/bin.ts",
    output: {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].js",
    },
    plugins,
    external,
  },
  {
    input: "./src/index.ts",
    output: {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].cjs.js",
    },
    plugins,
    external,
  },
  {
    input: "./src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].esm.js",
    },
    plugins,
    external,
  },
];
