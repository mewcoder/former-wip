import type { Schema } from '../types'
import { SchemaKeys } from '../shared'
export { get as getValue } from 'lodash-es'
export { set as setValue } from 'lodash-es'
export { cloneDeep } from 'lodash-es'

export * from './widget'
export * from './validate'
export * from './path'

export function isExpression(expression: any) {
  if (typeof expression !== 'string') return false

  const pattern = /^{\s*{(.+)}\s*}$/s
  const reg1 = /^{\s*{function\(.+}\s*}$/
  return expression.match(pattern) && !expression.match(reg1)
}

export function parseExpression(expression: any, formData, dependencies) {
  const scope = {
    $deps: dependencies || []
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

export function getOrderProperties(schema: Schema) {
  if (!schema.properties) return []
  const orderProperties: { schema: Schema; key: string }[] = []
  const unOrderProperties: { schema: Schema; key: string }[] = []

  for (const key in schema.properties) {
    const item = schema.properties[key]
    const index = item[SchemaKeys.Order]
    if (!isNaN(index)) {
      orderProperties[index] = { schema: item, key }
    } else {
      unOrderProperties.push({ schema: item, key })
    }
  }
  return orderProperties.filter((item) => !!item).concat(unOrderProperties)
}

export function isObjectField(schema: Schema) {
  return schema.type === 'object' && schema?.properties
}

export function isArrayField(schema: Schema) {
  return schema.type === 'array' && schema?.items
}

export function isEmptyField(schema: Schema) {
  return !schema || Object.keys(schema).length === 0
}

export function isVoidField(schema: Schema) {
  return schema.type === 'void'
}
