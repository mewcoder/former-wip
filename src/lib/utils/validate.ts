import { SchemaKeys } from '../shared'
import type { Schema, RuleItem } from '../types'

function addRequiredRule(schema: Schema, rules: RuleItem[]) {
  const { required, type } = schema
  const hasRequired = rules.some((item) => item?.required)
  // 未声明 required，或 rules 中存在 required 规则
  if (!required || hasRequired) {
    return
  }
  if (type === 'void') return

  const rule: RuleItem = {
    type,
    required: true,
    whitespace: true,
    message: '该项为必填项'
  }

  rules.push(rule)
}

function addLengthRule(schema: Schema, rules: RuleItem[]) {
  const { type, max, min, title } = schema

  if (max || max === 0) {
    // todo
    rules.push({ type, max, message: `${title}长度不能大于${max}` })
  }

  if (min || min === 0) {
    rules.push({ type, min, message: `${title}长度不能小于${min}` })
  }
}

export function getRules(schema: Schema) {
  const { title, pattern, format } = schema

  const rules = schema?.[SchemaKeys.FormProps]?.rules || []

  addRequiredRule(schema, rules)

  addLengthRule(schema, rules)

  if (pattern) {
    rules.push({ pattern, message: `'${title}未通过正则判断${pattern}'` })
  }

  if (format === 'url') {
    rules.push({ type: 'url', message: `${title}不符合url格式` })
  }

  if (format === 'email') {
    rules.push({ type: 'email', message: `${title}不符合email格式` })
  }

  return [...rules]
}
