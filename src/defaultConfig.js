import { defineConfig } from "taro-weapp-upload";

export default defineConfig({
  "version": "0.0.0",
  /** 需要上传的微信小程序 appid */
  "appid": [],
  /** 上传描述 */
  "description": "",
  /** 小程序项目根目录 即 project.config.json 所在的目录 */
  "projectPath": "/deploy/build/weapp/",
  /**
   * 存放上传key的文件夹
   * 里面密钥文件的命名格式：`private.${appid}.key`
   * 具体获取方式看文档
   * @see https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#%E5%AF%86%E9%92%A5%E5%8F%8A-IP-%E7%99%BD%E5%90%8D%E5%8D%95%E9%85%8D%E7%BD%AE
   */
  "privateKeyPath": "/key/"
})