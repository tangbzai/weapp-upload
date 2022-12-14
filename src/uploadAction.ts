import fs from "fs"
import ci from "miniprogram-ci"
import { MiniProgramCI } from "miniprogram-ci/dist/@types/types"
import { join } from "path"
import type { ConfigType } from "../index.d"
import formatDescription from "./utils/formatDescription"
import lastCommit from "./utils/lastCommit"
import log, { dye } from "./utils/log"

function readProjectConfig(projectPath?: string): {
  setting?: MiniProgramCI.ICompileSettings
} {
  try {
    const configStr = fs
      .readFileSync(join(process.cwd(), `${projectPath}/project.config.json`))
      .toString()
    return JSON.parse(configStr) || {}
  } catch (err) {
    log.warning("获取 config 失败!")
    return {}
  }
}

export default async function uploadAction(config: ConfigType) {
  const commitInfo = lastCommit()
  const desc = formatDescription(config.description, {
    ...commitInfo,
    version: config.version,
  })

  log.log("准备上传小程序到微信")
  const { setting } = readProjectConfig(config.projectPath)
  const { appid: appidList, version } = config
  try {
    const resolveList = await Promise.all(
      appidList.map(async (appid) => {
        if (!fs.existsSync(`${join(process.cwd(), config.privateKeyPath)}/private.${appid}.key`)) {
          log.warning("Warring:" + `${appid}: key不存在，中断上传`)
          return
        }
        log.log(`${appid}生成project`)
        const project = new ci.Project({
          appid,
          type: "miniProgram",
          projectPath: `${join(process.cwd(), config.projectPath)}`,
          privateKeyPath:
            config.privateKeyPath &&
            `${join(process.cwd(), config.privateKeyPath)}/private.${appid}.key`,
          ignores: ["node_modules/**/*"],
        })
        log.log(`${appid}生成project成功`)
        try {
          const uploadResult = await ci.upload({
            project,
            version,
            desc,
            setting,
          })
          return { appid, uploadResult }
        } catch (err) {
          log.warning("Warring:" + `${appid}: 上传失败！`)
          throw new Error(`${appid}: 上传失败！`)
        }
      })
    )
    log.log(`上传完成：[${version}] ${commitInfo.info}`)
    resolveList.forEach(({ appid }) => {
      log.success(`${appid} 上传完成`)
    })
    log.log("------各分包大小------")
    resolveList[0].uploadResult.subPackageInfo.forEach((item) =>
      log.log(
        dye("success", `${item.name}：`) +
          dye("warning", `${(item.size / 1024).toFixed(2)}/${2048}KB`)
      )
    )
  } catch (error) {
    log.error("Error:" + (error as Error).message)
  }
  log.log("---------------------")
}
