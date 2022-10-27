import { join } from "path";
import fs from "fs";
import { createInterface } from "readline";
import lastCommit from "../utils/lastCommit";

const CONFIG_PATH = "wx-upload-config.json";
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getConfig() {
  if (!fs.existsSync(join(process.cwd(), CONFIG_PATH))) {
    console.log("wx-upload-config.json不存在");
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
    console.warn("\x1B[33mWarring:", "配置文件解析失败！请检查");
    return {};
  }
}

/**
 * Promise 版的 question
 */
function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    readline.question(query, (answer) => {
      resolve(answer);
      readline.close();
    });
  });
}

/**
 * 格式化描述
 */
function formatDescription(
  description?: string,
  baseData?: { version?: string } & LastCommitType
) {
  const mapping = {
    "${TIME}": baseData.buildTime,
    "${VERSION}": baseData.version,
    "${AUTHOR}": baseData.author,
    "${BRANCH}": baseData.branch,
    "${COMMIT}": baseData.commit,
    "${DATE}": baseData.date,
    "${INFO}": baseData.info,
  };
  return Object.entries(mapping).reduce(
    (des, [tmp, val]) => des.replace(tmp, val),
    description
  );
}

export default async function uploadAction() {
  const config = getConfig();
  console.log(config);
  if (!config.version) {
    const version = await question("\x1B[96m" + "请输入版本号：");
    config.version = version;
  }
  if (!config.appid?.length) {
    const appidStr = await question(
      "\x1B[96m" + "请输入appid-多个小程序用','分隔："
    );
    const appid = appidStr
      .split(",")
      .map((item) => item.trim())
      .filter((t) => t);
    config.appid = appid;
  }
  const commitInfo = lastCommit();
  const descText = formatDescription(config.description, {
    ...commitInfo,
    version: config.version,
  });
  console.log(descText);
  return;
}
