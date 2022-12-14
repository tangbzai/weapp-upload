import fs from "fs"
import { join } from "path"
import process from "process"
import templateConfig from "./templateConfig"
import { CONFIG_PATH } from "./utils/getConfig"

export default function init() {
  fs.writeFileSync(join(process.cwd(), CONFIG_PATH), templateConfig())
}
