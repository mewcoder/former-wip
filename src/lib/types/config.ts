import type { ConcreteComponent } from 'vue'
import { SchemaKeys } from '../shared'
export interface Option {
  label: string
  value: any
}

type Widget = string | ConcreteComponent

export interface WidgetChildrenItem {
  [SchemaKeys.WidgetType]: string
  [SchemaKeys.WidgetProps]?: object
  [SchemaKeys.WidgetChildren]?: (string | WidgetChildrenItem)[]
}

export interface WidgetPresetConfig {
  widget: Widget
  props?: Record<string, any>
  generateChildren?: (options: Option[]) => WidgetChildrenItem[]
  propMapping?: Record<string, string>
}

export interface PresetConfig {
  widgets?: Record<string, WidgetPresetConfig | Widget>
  defaultModelProp?: string
}
