import type { RuleItem } from './rule'

export type SchemaType =
  | 'string'
  | 'object'
  | 'array'
  | 'number'
  | 'boolean'
  | 'void'
  | 'date'
  | 'datetime'
  | (string & {})

export type FormatType =
  | 'url'
  | 'email'
  | 'ipv6'
  | 'ipv4'
  | 'number'
  | 'integer'
  | 'idcard'
  | 'qq'
  | 'phone'
  | 'money'
  | 'zh'
  | 'date'
  | 'zip'
  | (string & {})

/** 支持 {{  a === b }} 形式的表达式 */
type Expression = string

interface SchemaBase {
  type?: SchemaType
  title?: string // 标签
  description?: string
  default?: any // 默认值
  properties?: Record<string, Schema> // 对象属性
  items?: Schema // 数组元素
}

// 字段校验相关的 Schema
interface SchemaValidation {
  /** 是否必填，不支持数组形式的配置 */
  required?: boolean | Expression
  /** 字符串校验 */
  format?: FormatType
  pattern?: string | RegExp

  /** 字符串长度校验 */
  maxLength?: number | Expression
  minLength?: number | Expression
  /** 数字大小校验 */
  maximum?: number | Expression
  minimum?: number | Expression
  /** 数组个数校验 */
  maxItems?: number | Expression
  minItems?: number | Expression

  /** 上面的 maxXxx 和 minXxx 统一简写为 min 和 max 即可 */

  /** 最小值 支持表达式 */
  min?: number | Expression
  /** 最大值，支持表达式 */
  max?: number | Expression

  /** async-validator 校验规则 */
  rules?: RuleItem | RuleItem[]
}

// 和 UI 相关的扩展 Schema
interface SchemaUI {
  /** 组件 */
  ['ui-widget']?: string

  /** 组件透传属性 */
  ['ui-props']?: Record<string, any>

  /** form-item 透传属性 */
  ['ui-field-props']?: Record<string, any>

  /** 栅格 透传属性 */
  ['ui-grid-props']?: Record<string, any>

  /** 是否禁用 */
  ['ui-disabled']?: boolean | Expression

  /** 是否只读 */
  ['ui-read-only']?: boolean | Expression

  /** 是否隐藏，数据不保留  */
  ['ui-hidden']?: boolean | Expression

  /** 序号  */
  ['ui-order']?: number

  [key: string]: any
}

export type Schema = SchemaBase & SchemaValidation & SchemaUI
