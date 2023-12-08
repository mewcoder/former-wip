import { resolveComponent, type ConcreteComponent } from 'vue'
import type {
  Schema,
  PresetConfig,
  WidgetPresetConfig,
  WidgetChildrenItem
} from '../types'
import { SchemaKeys } from '../shared'

function getWidgetPresetConfig(
  widgetType: string,
  config: PresetConfig
): WidgetPresetConfig | undefined {
  if (!widgetType) {
    console.warn('widget is required')
    return
  }
  const widgetConfig = config?.widgets?.[widgetType]
  if (typeof widgetConfig === 'string') {
    return {
      widget: widgetConfig
    }
  } else {
    return widgetConfig
  }
}

// 判断是配置对象
export function isWidgetPresetConfig(widgetPresetConfig: WidgetPresetConfig) {
  return typeof widgetPresetConfig === 'object' && widgetPresetConfig !== null
}

export function getComponentByType(
  config: PresetConfig,
  widgetType: string
): {
  component: ConcreteComponent | string
  presetProps: object
} {
  // 获取预设配置
  const widgetPresetConfig = getWidgetPresetConfig(widgetType, config)

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

export function getComponent(
  schema: { [SchemaKeys.WidgetType]: string },
  config: PresetConfig
): {
  component: ConcreteComponent | string
  presetProps: object
} {
  const widgetType = schema[SchemaKeys.WidgetType]

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
  widgetType: string,
  prop: string,
  defaultProp: string
) {
  const widgetPresetConfig = getWidgetPresetConfig(widgetType, config)
  if (widgetPresetConfig) {
    return widgetPresetConfig?.propMapping?.[prop] || defaultProp
  }
  return defaultProp
}

// options 映射成 children
export function getChildren(
  schema: Schema,
  config: PresetConfig
): WidgetChildrenItem[] {
  const widgetType = schema[SchemaKeys.WidgetType]
  if (!widgetType) return []
  const widgetPresetConfig = getWidgetPresetConfig(widgetType, config)

  if (schema[SchemaKeys.WidgetChildren]) {
    return schema[SchemaKeys.WidgetChildren]
  } else if (widgetPresetConfig && widgetPresetConfig?.generateChildren) {
    return widgetPresetConfig.generateChildren(
      schema?.[SchemaKeys.WidgetProps]?.options || []
    )
  }
  return []
}
