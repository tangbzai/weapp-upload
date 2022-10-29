import { join } from "path";
import fs from "fs";
import { ConfigType } from "../index.d";

const CONFIG_PATH = "wx-upload-config.json";

export default function getConfig(): ConfigType {
  if (!fs.existsSync(join(process.cwd(), CONFIG_PATH))) {
    console.log(`${CONFIG_PATH}不存在`);
    return {};
  }
  const configStr = fs.readFileSync(join(process.cwd(), CONFIG_PATH), {
    encoding: "utf8",
  });
  try {
    const config = JSON.parse(configStr);
    return {
      ...config,
      appid: typeof config.appid === "string" ? [config.appid] : config.appid,
    };
  } catch (err) {
    console.warn("\x1B[33mWarring:" + "配置文件解析失败,请检查!");
    return {};
  }
}
