// 检查当前环境是否支持 ESM
function isESMEnabled() {
  try {
    eval('import("./bin.mjs")')
    return true
  } catch (error) {
    return false
  }
}

// 根据环境条件选择要执行的模块
if (isESMEnabled()) {
  import("../dist/bin.mjs")
} else {
  require("../dist/bin.cjs")
}
