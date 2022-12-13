import fs from "fs";
import process from "process";
import { join } from "path";
import { CONFIG_PATH } from "../utils/getConfig";
import templateConfig from "./templateConfig";

export default function init() {
  fs.writeFileSync(
    join(process.cwd(), CONFIG_PATH),
    templateConfig()
  );
}
