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

export function parseExpression(expression: any, formData, dependencies) {
  const $deps = dependencies || []

  const scope = {
    $deps
  }

  if (typeof expression === 'string') {
    const funcBody = expression
      .replace(/^{\s*{/g, '')
      .replace(/}\s*}$/g, '')
      .trim()
    const funcStr = `
      return ${funcBody.replace(
        /(\$deps\[\d+\])/g,
        JSON.stringify(formData) + '[$1]'
      )}
    `
    try {
      const result = new Function('$root', `with($root) { ${funcStr} }`)(scope)
      return result
    } catch (error) {
      console.log(error, expression)
      return null
    }
  }
  return expression
}
