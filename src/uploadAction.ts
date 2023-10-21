import fs from "fs"
import ci from "miniprogram-ci"
import { MiniProgramCI } from "miniprogram-ci/dist/@types/types"
import { join } from "path"
import type { ConfigType } from "../index.d"
import formatDescription from "./utils/formatDescription"
import lastCommit from "./utils/lastCommit"
import log, { dye } from "./utils/log"

/**
 * 读取小程序配置文件
 * @param projectPath 小程序项目路径
 */
function readProjectConfig(projectPath?: string): {
  setting?: MiniProgramCI.ICompileSettings
} {
  try {
    const configStr = fs.readFileSync(`${projectPath}/project.config.json`).toString()
    return JSON.parse(configStr) || {}
  } catch (err) {
    log.warning("获取 config 失败!")
    return {}
  }
}

export default async function uploadAction({
  appid: appidList,
  description,
  projectPath: configProjectPath,
  privateKeyPath,
  version,
}: ConfigType) {
  const commitInfo = lastCommit()
  if (!configProjectPath) throw new Error("需要指定小程序项目路径(projectPath)")
  // 小程序项目路径
  const projectPath = `${join(process.cwd(), configProjectPath)}`
  if (!privateKeyPath) throw new Error("需要指定私钥文件夹路径(privateKeyPath)")
  // 存放私钥的文件夹路径
  const privateKeyFolderPath = join(process.cwd(), privateKeyPath)
  // 处理描述变量转换
  const desc = formatDescription(description, { ...commitInfo, version })

  log.log("准备上传小程序到微信")
  const { setting } = readProjectConfig(projectPath)
  const resolveList = await Promise.all(
    appidList.map(async (appid) => {
      // 组成私钥文件地址
      const privateKeyPath = `${privateKeyFolderPath}/private.${appid}.key`
      if (!fs.existsSync(privateKeyPath)) {
        log.warning("Warring:" + `${appid}: key不存在，中断上传`)
        return
      }
      log.log(`${appid}生成project`)
      const project = new ci.Project({
        appid,
        type: "miniProgram",
        projectPath,
        privateKeyPath,
        ignores: ["node_modules/**/*"],
      })
      log.log(`${appid}生成project成功`)
      // 开始上传
      try {
        const uploadResult = await ci.upload({ project, version, desc, setting })
        return { appid, uploadResult }
      } catch (err) {
        log.warning("Warring:" + `${appid}: 上传失败！`)
        throw new Error(`${appid}: 上传失败！`)
      }
    })
  )
  // 展示上传结果
  log.log(`上传完成：[${version}] ${commitInfo.info}`)
  resolveList.forEach(({ appid }) => {
    log.success(`${appid} 上传完成`)
  })
  log.log("------各分包大小------")
  // 因为都是同样的项目所以分包大小显示第一个返回即可
  resolveList[0].uploadResult.subPackageInfo.forEach((item) =>
    log.log(
      dye("success", `${item.name}：`) +
        dye("warning", `${(item.size / 1024).toFixed(2)}/${2048}KB`)
    )
  )
  log.log("---------------------")
}
