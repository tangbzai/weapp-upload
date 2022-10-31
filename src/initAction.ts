import fs from "fs";
import process from "process";
import { join } from "path";
import { CONFIG_PATH } from "../utils/getConfig";

export default function init() {
  fs.writeFileSync(
    join(process.cwd(), CONFIG_PATH),
    fs.readFileSync("./defaultConfig.json").toString()
  );
}
