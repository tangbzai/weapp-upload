export default function dateFormat(dateStr: string | number | Date): string {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
