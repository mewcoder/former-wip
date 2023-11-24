export { get as getValue } from 'lodash-es'
export { set as setValue } from 'lodash-es'

export * from './widget'
export * from './validate'

export function isExpression(expression: any) {
  if (typeof expression !== 'string') return false

  const pattern = /^{\s*{(.+)}\s*}$/s
  const reg1 = /^{\s*{function\(.+}\s*}$/
  return expression.match(pattern) && !expression.match(reg1)
}

export function parseExpression(expression: any, formData) {
  if (typeof expression === 'string') {
    const funcBody = expression
      .replace(/^{\s*{/g, '')
      .replace(/}\s*}$/g, '')
      .trim()
    const funcStr = `
      return ${funcBody.replace(/formData/g, JSON.stringify(formData))}
    `
    console.log(funcStr)
    try {
      const result = Function(funcStr)()
      return result
    } catch (error) {
      //console.log(error, funcStr, parentPath);
      return null // 如果计算有错误，return null 最合适
    }
  }
  return expression
}
