// 拼接路径
export function getPath(path: string[], prop: string) {
  return prop ? [...path, prop] : [...path]
}
