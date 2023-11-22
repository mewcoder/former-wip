export interface Option {
  label: string
  value: any
}

export interface ChildrenItem {
  widget: string
  props?: object
  children?: (string | ChildrenItem)[]
}

export interface WidgetConfig {
  widget: string
  props?: Record<string, any>
  generateChildren?: (options: Option[]) => ChildrenItem[]
  propMapping?: Record<string, string>
}

export interface WidgetsConfig {
  widgets: Record<string, string | WidgetConfig>
  defaultModelProp?: string
}

export type SchemaType =
  | 'string'
  | 'object'
  | 'array'
  | 'number'
  | 'boolean'
  | 'void'
  | 'date'
  | 'datetime'
  | 'block'
  | string

export interface SchemaBase {
  type?: SchemaType
  title?: string
  description?: string
  format?:
    | 'image'
    | 'textarea'
    | 'color'
    | 'email'
    | 'url'
    | 'dateTime'
    | 'date'
    | 'time'
    | 'upload'
    | (string & {})
  default?: any
  /** 是否必填，支持 `'{{ formData.xxx === "" }}'` 形式的表达式 */
  required?: boolean | string
  placeholder?: string
  bind?: false | string | string[]
  dependencies?: string[]
  /** 最小值，支持表达式 */
  min?: number | string
  /** 最大值，支持表达式 */
  max?: number | string
  /** 是否禁用，支持 `'{{ formData.xxx === "" }}'` 形式的表达式 */
  disabled?: boolean | string
  /** 是否只读，支持 `'{{ formData.xxx === "" }}'` 形式的表达式 */
  readOnly?: boolean | string
  /** 是否隐藏，隐藏的字段不会在 formData 里透出，支持 `'{{ formData.xxx === "" }}'` 形式的表达式 */
  hidden?: boolean | string
  displayType?: 'row' | 'column' | string
  width?: string | number
  labelWidth?: number | string
  maxWidth?: number | string
  column?: number
  className?: string
  widget?: string
  readOnlyWidget?: string
  extra?: string
  properties?: Record<string, Schema>
  items?: Schema
  /** 多选，支持表达式 */
  enum?: Array<string | number> | string
  /** 多选label，支持表达式 */
  enumNames?: Array<string | number> | string

  props?: Record<string, any>

  cellSpan?: number
  span?: number
  validateTrigger?: string | string[]
  [key: string]: any
}

export type Schema = Partial<SchemaBase>
