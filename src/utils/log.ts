const _log_color = {
  log: "\x1B[37m",
  success: "\x1B[32m",
  warning: "\x1B[33m",
  error: "\x1B[31m",
  aqua: "\x1B[96m",
}
type colorType = typeof _log_color

export function dye(color: keyof colorType, msg?: any) {
  return _log_color[color] + `${msg}` + _log_color.log
}

export default Object.entries(_log_color).reduce(
  <T extends keyof colorType>(acc, [method, color]: [T, typeof _log_color[T]]) => ({
    ...acc,
    [method]: function (msg, ...arg) {
      console.log(color + msg, ...arg, _log_color.log)
    },
  }),
  {} as Record<keyof colorType, (message: any, ...optionalParams: any[]) => void>
)
