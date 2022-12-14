export type ConfigType = {
  version?: string;
  appid?: string[];
  description?: string;
  /** project.config.json 所在的路径 */
  projectPath?: string;
  /** 私钥文件的路径 */
  privateKeyPath?: string;
};

export type LastCommitType = {
  commit?: string;
  merge?: string;
  author?: string;
  date?: string;
  info?: string;
  branch?: string;
  buildTime?: string;
};

export function defineConfig(config: ConfigType): ConfigType

/** 生成配置文件 */
export function init(): void

/** 
 * 上传行为
 * @param config 上传配置
 */
export function uploadAction(config: ConfigType): Promise<void>
