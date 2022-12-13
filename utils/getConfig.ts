import { join } from "path";
import fs from "fs";
import { ConfigType } from "../index.d";
import log from "./log";

export const CONFIG_PATH = "weapp-upload.config.js";

function getConfigFn(str?: string): ConfigType {
  if(!str) throw new Error(`${CONFIG_PATH}配置文件不存在！`)
  const objStr = str.match(/(?<=export default (defineConfig)?)\([^\{]*\{[^]*\n/)?.[0]
  return {
    version: objStr.match(/(?<=version:[^"]*").*(?=")/)?.[0],
    appid: objStr.match(/(?<=appid:[^\[]*\[).*(?=\])/)?.[0].split(',').map(t => t.replace(/[^\w]*/g, '')),
    description: objStr.match(/(?<=description:[^"]*").*(?=")/)?.[0],
    projectPath: objStr.match(/(?<=projectPath:[^"]*").*(?=")/)?.[0],
    privateKey: objStr.match(/(?<=privateKey:[^"]*").*(?=")/)?.[0],
    privateKeyPath: objStr.match(/(?<=privateKeyPath:[^"]*").*(?=")/)?.[0]
  }
}

export default function getConfig(): ConfigType {
  if (!fs.existsSync(join(process.cwd(), CONFIG_PATH))) {
    log.log(`${CONFIG_PATH}不存在`);
    return {};
  }
  const configStr = fs.readFileSync(join(process.cwd(), CONFIG_PATH), {
    encoding: "utf8",
  });
  try {
    const config = getConfigFn(configStr);
    return {
      ...config,
      appid: typeof config.appid === "string" ? [config.appid] : config.appid,
    };
  } catch (err) {
    log.warning("Warring:" + "配置文件解析失败,请检查!");
    return {};
  }
}
