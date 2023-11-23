import type { ConcreteComponent } from 'vue'
export interface Option {
  label: string
  value: any
}

type Widget = string | ConcreteComponent

export interface ChildrenItem {
  'ui-widget': Widget
  'ui-props'?: object
  children?: (string | ChildrenItem)[]
}

export interface WidgetPresetConfig {
  widget: Widget
  props?: Record<string, any>
  generateChildren?: (options: Option[]) => ChildrenItem[]
  propMapping?: Record<string, string>
}

export interface PresetConfig {
  widgets: Record<string, WidgetPresetConfig | string>
  defaultModelProp?: string
}
