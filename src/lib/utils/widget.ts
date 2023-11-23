import { resolveComponent, type ConcreteComponent } from 'vue'
import type {
  Schema,
  PresetConfig,
  WidgetPresetConfig,
  WidgetChildren
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
  widgetType: string,
  config: PresetConfig
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
  schema: Schema,
  config: PresetConfig
): {
  component: ConcreteComponent | string
  presetProps: object
} {
  const widgetType = schema[SchemaKeys.WidgetType]

  console.log('widgetType', widgetType)

  if (!widgetType) {
    console.warn('widget is required')
    return {
      component: 'div',
      presetProps: {}
    }
  }
  return getComponentByType(widgetType, config)
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

export function generateChildren(
  schema: Schema,
  config: PresetConfig
): WidgetChildren[] {
  const widgetType = schema[SchemaKeys.WidgetType]
  if (!widgetType) return []
  const widgetPresetConfig = getWidgetPresetConfig(widgetType, config)
  if (widgetPresetConfig && widgetPresetConfig?.generateChildren) {
    console.log(schema[SchemaKeys.WidgetProps])
    return widgetPresetConfig.generateChildren(
      schema?.[SchemaKeys.WidgetProps]?.options || []
    )
  }
  return []
}
