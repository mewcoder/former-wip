import { resolveComponent, type ConcreteComponent } from 'vue'
import type {
  Schema,
  PresetConfig,
  WidgetPresetConfig,
  WidgetChildrenItem
} from '../types'
import { SchemaKeys } from '../shared'

// 判断是配置对象
export function isWidgetPresetConfig(
  config: any
): config is WidgetPresetConfig {
  return typeof config === 'object' && 'widget' in config
}

// 获取组件预置配置
function getWidgetPresetConfig(
  config: PresetConfig,
  widgetType: string
): WidgetPresetConfig | undefined {
  if (!widgetType) {
    console.warn('widget is required')
    return
  }
  const widgetConfig = config?.widgets?.[widgetType]
  if (!widgetConfig) return
  if (!isWidgetPresetConfig(widgetConfig))
    return {
      widget: widgetConfig
    }
  return widgetConfig
}

// 通过组件类型获取组件
export function getComponentByType(
  config: PresetConfig,
  widgetType: string
): {
  component: ConcreteComponent | string
  presetProps: object
} {
  // 获取预设配置
  const widgetPresetConfig = getWidgetPresetConfig(config, widgetType)

  const component: ConcreteComponent | string =
    widgetPresetConfig?.widget || widgetType

  const presetProps = widgetPresetConfig?.props || {}

  return typeof component === 'string'
    ? {
        component: resolveComponent(component),
        presetProps
      }
    : {
        component,
        presetProps
      }
}

// 通过schema获取组件
export function getComponent(
  config: PresetConfig,
  schema: { [SchemaKeys.WidgetType]?: string },
  defaultWidgetType?: string
): {
  component: ConcreteComponent | string
  presetProps: object
} {
  if (schema[SchemaKeys.HtmlType])
    return {
      component: schema[SchemaKeys.HtmlType],
      presetProps: {}
    }

  const widgetType = schema[SchemaKeys.WidgetType] || defaultWidgetType

  if (!widgetType) {
    console.warn('widget is required')
    return {
      component: 'div',
      presetProps: {}
    }
  }
  return getComponentByType(config, widgetType)
}

// 获取 prop 映射
export function getMappingProp(
  config: PresetConfig,
  widgetType: string | undefined,
  prop: string,
  defaultProp: string
) {
  if (!widgetType) return defaultProp
  const widgetPresetConfig = getWidgetPresetConfig(config, widgetType)
  if (widgetPresetConfig) {
    return widgetPresetConfig?.propMapping?.[prop] || defaultProp
  }
  return defaultProp
}

// options 映射成 children
export function getChildren(
  config: PresetConfig,
  schema: Schema
): WidgetChildrenItem[] {
  if (schema[SchemaKeys.WidgetChildren])
    return schema[SchemaKeys.WidgetChildren]

  const widgetType = schema[SchemaKeys.WidgetType]

  if (!widgetType) return []

  const widgetPresetConfig = getWidgetPresetConfig(config, widgetType)

  if (widgetPresetConfig && widgetPresetConfig?.generateChildren) {
    return widgetPresetConfig.generateChildren(
      schema?.[SchemaKeys.WidgetProps]?.options || []
    )
  }
  return []
}
