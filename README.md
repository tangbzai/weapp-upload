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

### 上传代码
```
npm run upload
```