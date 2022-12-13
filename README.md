## taro-weapp-upload

### 介绍
用于Taro项目中批量上传微信小程序的工具

### 脚本调用
```
npm install taro-weapp-upload -D
```
### 修改package.json文件
```json
// ...
"script": {
  // ...
  "init": "weapp-upload init",
  "upload": "weapp-upload upload"
  // ...
}
```

### 生成配置文件
```
npm run init
```
#### version 
上传的版本号

#### appid
微信小程序的appid列表
#### description
支持变量
变量|说明
---|---
\${TIME}| 开始上传的时间
\${VERSION}| 配置文件中的`version`字段的值
\${AUTHOR}| `git log -1`的作者
\${BRANCH}| 当前 git 分支
\${COMMIT}| `git log -1`的`commit`hash值（commit id)
\${DATE}| `git log -1`的`commit`时间
\${INFO}| `git log -1`的`commit`内容
#### projectPath
微信小程序项目的根目录，即 project.config.json 所在的路径

#### privateKey

#### privateKeyPath
存放上传key的文件夹<br />
里面密钥文件的命名格式：`private.${appid}.key`；获取方式看[文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#%E5%AF%86%E9%92%A5%E5%8F%8A-IP-%E7%99%BD%E5%90%8D%E5%8D%95%E9%85%8D%E7%BD%AE)
### 上传代码
```
npm run upload
```