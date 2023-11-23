import type { ConcreteComponent } from 'vue'
import { SchemaKeys } from '../shared'
export interface Option {
  label: string
  value: any
}

type Widget = string | ConcreteComponent

export interface WidgetChildren {
  [SchemaKeys.WidgetType]: string
  [SchemaKeys.WidgetProps]?: object
  [SchemaKeys.WidgetChildren]?: (string | WidgetChildren)[]
}

export interface WidgetPresetConfig {
  widget: Widget
  props?: Record<string, any>
  generateChildren?: (options: Option[]) => WidgetChildren[]
  propMapping?: Record<string, string>
}

export interface PresetConfig {
  widgets: Record<string, WidgetPresetConfig | string>
  defaultModelProp?: string
}
