import { program } from "commander";
import { createInterface } from "readline";
import process from "process";
import getConfig from "../utils/getConfig";
import uploadAction from "./uploadAction";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const upload = program.command("upload");

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

upload.action(async () => {
  const config = getConfig();
  console.log(config);
  if (!config.version) {
    const version = await question("\x1B[96m" + "请输入版本号:");
    config.version = version;
  }
  if (!config.appid?.length) {
    const appidStr = await question(
      "\x1B[96m" + "请输入appid-多个小程序用','分隔:"
    );
    const appid = appidStr
      .split(",")
      .map((item) => item.trim())
      .filter((t) => t);
    config.appid = appid;
  }
  await uploadAction(config);
  process.exit();
});
