import fs from "fs"
import { defineConfig } from "rollup"
import type { OutputAsset, OutputChunk } from "rollup"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import commonjs from "@rollup/plugin-commonjs"

const pkg = JSON.parse(fs.readFileSync("./package.json").toString())
const plugins = [
  resolve(),
  commonjs({
    ignore: ["conditional-runtime-dependency"],
  }),
  typescript(),
]

const deps = [...Object.keys(pkg.dependencies)]
const external = (id) => deps.includes(id)

function addPrefix(prefix?: string) {
  return {
    name: "addPrefix",
    generateBundle(_, bundleMap: Record<string, OutputAsset | OutputChunk>) {
      if (!prefix) return
      Object.values(bundleMap).forEach((bundle) => {
        if ("isEntry" in bundle && bundle.isEntry) {
          bundle.code = prefix + bundle.code
        }
      })
    },
  }
}
function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = `${dirPath}/${file}`
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirectory(curPath) // 递归删除子目录
      } else {
        fs.unlinkSync(curPath) // 删除文件
      }
    })
    fs.rmdirSync(dirPath) // 删除空目录
  }
}

deleteDirectory("dist")
export default defineConfig([
  {
    input: "./src/bin.ts",
    output: [
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "[name].cjs",
      },
    ],
    plugins: [...plugins, addPrefix("#!/usr/bin/env node\n")],
    external,
    watch: {
      include: "./static/bin.js",
    },
    treeshake: true,
  },
  {
    input: "./src/index.ts",
    output: [
      {
        dir: "dist",
        format: "cjs",
        entryFileNames: "[name].cjs.js",
      },
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "[name].esm.js",
      },
    ],
    plugins,
    external,
  },
])
