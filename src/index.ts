import { ConfigType } from "../index.d"
import init from "./initAction"
import uploadAction from "./uploadAction"

const defineConfig = (config: ConfigType): ConfigType => config

export { init, uploadAction, defineConfig }
