import type { ConcreteComponent } from 'vue'
export interface Option {
  label: string
  value: any
}

type Widget = string | ConcreteComponent

export interface WidgetChildren {
  'ui-widget': Widget
  'ui-props'?: object
  'ui-children'?: (string | WidgetChildren)[]
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
