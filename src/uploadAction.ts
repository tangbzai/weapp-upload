import { join } from "path";
import fs from "fs";
import ci from "miniprogram-ci";
import lastCommit from "../utils/lastCommit";
import type { ConfigType, LastCommitType } from "../index.d";
import { MiniProgramCI } from "miniprogram-ci/dist/@types/types";

/**
 * 格式化描述
 */
function formatDescription(
  description?: string,
  baseData?: { version?: string } & LastCommitType
) {
  if (!description) return undefined;
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

export default async function uploadAction(config: ConfigType) {
  const commitInfo = lastCommit();
  const desc = formatDescription(config.description, {
    ...commitInfo,
    version: config.version,
  });

  console.log("准备上传小程序到微信");
  console.log("生成project");
  const { setting } = readProjectConfig(config.projectPath);
  const { appid: appidList, version } = config;
  appidList.forEach(async (appid) => {
    if (!fs.existsSync(`${process.cwd()}/key/private.${appid}.key`)) {
      console.warn("\x1B[33mWarring:" + `${appid}: key不存在，中断上传`);
      return;
    }
    const project = new ci.Project({
      appid,
      type: "miniProgram",
      projectPath: `${process.cwd()}/deploy/build/weapp/`,
      privateKeyPath: `${process.cwd()}/key/private.${appid}.key`,
      ignores: ["node_modules/**/*"],
    });
    console.log("生成project成功");
    try {
      const uploadResult = await ci.upload({ project, version, desc, setting });
      console.log(`\x1B[32m${appid} 上传完成:[${version}] ${commitInfo.info}`);
      console.log("\x1B[37m------各分包大小------");
      uploadResult.subPackageInfo.forEach((item) =>
        console.log(
          `\x1B[32m${item.name}:` +
            `\x1B[33m${(item.size / 1024).toFixed(2)}/${2048}KB`
        )
      );
    } catch (err) {
      console.warn("\x1B[33mWarring:" + `${appid}: 上传失败！`);
    }
  });
  console.log("\x1B[37m---------------------");
}

function readProjectConfig(projectPath?: string): {
  setting?: MiniProgramCI.ICompileSettings;
} {
  try {
    const configStr = fs
      .readFileSync(join(process.cwd(), `${projectPath}/project.config.json`))
      .toString();
    return JSON.parse(configStr) || {};
  } catch (err) {
    console.error("获取 config 失败!");
    return {};
  }
}
