export type ConfigType = {
  version?: string;
  appid?: string[];
  description?: string;
  /** project.config.json 所在的路径 */
  projectPath?: string;
  /** 私钥内容 */
  privateKey?: string;
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