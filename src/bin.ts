import { program } from "commander";
import process from "process";
import getConfig from "../utils/getConfig";
import uploadAction from "./uploadAction";
import initAction from "./initAction";
import question from "../utils/question";
import { dye } from "../utils/log";

const init = program.command("init");
const upload = program.command("upload");

init.action(initAction);
program.addCommand(init);

upload.action(async () => {
  const config = getConfig();
  if (!config.version) {
    const version = await question(dye("aqua", "请输入版本号:"));
    config.version = version;
  }
  if (!config.appid?.length) {
    const appidStr = await question(
      dye("aqua", "请输入appid(多个小程序用','分隔):")
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

program.addCommand(upload);
program.parse(process.argv);
