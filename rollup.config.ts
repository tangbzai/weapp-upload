import type { OutputAsset, OutputChunk } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import fs from "fs";

const pkg = JSON.parse(fs.readFileSync("./package.json").toString());
const plugins = [resolve(), commonjs(), typescript()];

const deps = [...Object.keys(pkg.dependencies)];
const external = (id) => deps.includes(id);

function addPrefix(prefix?: string) {
  return {
    name: "addPrefix",
    generateBundle(_, bundleMap: Record<string, OutputAsset | OutputChunk>) {
      if (!prefix) return;
      Object.values(bundleMap).forEach((bundle) => {
        if ("isEntry" in bundle && bundle.isEntry) {
          bundle.code = prefix + bundle.code;
        }
      });
    },
  };
}

export default [
  {
    input: "./src/bin.ts",
    output: {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].js",
    },
    plugins: [...plugins, addPrefix("#!/usr/bin/env node\n")],
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
