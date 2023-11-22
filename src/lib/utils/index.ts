import { resolveComponent, type ConcreteComponent } from 'vue'
import type {
  Schema,
  WidgetsConfig,
  WidgetConfig,
  ChildrenItem
} from '../types'

export { get as getValue } from 'lodash-es'
export { set as setValue } from 'lodash-es'

export function getComponent(
  name: string,
  config: WidgetsConfig
): {
  Component: ConcreteComponent | string
  presetProps: object
} {
  const { widgets } = config

  let component: ConcreteComponent | string = widgets[name] || name

  let props = {}

  if (typeof component === 'object' && component?.widget) {
    props = component?.props || {}
    component = component.widget
  }

  if (typeof component === 'string') {
    component = resolveComponent(component)
  }

  return {
    Component: component,
    presetProps: props
  }
}

export function getInitValue(schema: Schema) {
  if (schema.type === 'string') return ''
  else if (schema.type === 'number') return 0
  else if (schema.type === 'boolean') return false
  else if (schema.type === 'array') return []
}

export function getMappingProp(
  config: WidgetsConfig,
  widget: string,
  prop: string,
  defaultProp: string
) {
  const widgetConfig = config?.widgets[widget]
  if (isWidgetConfig(widgetConfig) && widgetConfig.propMapping?.[prop]) {
    return widgetConfig.propMapping[prop]
  }
  return defaultProp
}

export function getVModelProp(schema: Schema, config: WidgetsConfig) {
  const widgetConfig = schema.widget && config.widgets[schema.widget]
  if (isWidgetConfig(widgetConfig) && widgetConfig.propMapping?.model) {
    return widgetConfig.propMapping?.model
  }
  if (config?.defaultModelProp) return config.defaultModelProp
  return 'modelValue'
}

export function generateChildren(
  schema: Schema,
  config: WidgetsConfig
): ChildrenItem[] {
  const widgetConfig = schema.widget && config.widgets[schema.widget]
  if (
    schema.props?.options &&
    isWidgetConfig(widgetConfig) &&
    widgetConfig?.generateChildren
  ) {
    return widgetConfig.generateChildren(schema.props.options)
  }
  return []
}

export function isWidgetConfig(
  widgetConfig: undefined | string | WidgetConfig
): widgetConfig is WidgetConfig {
  return typeof widgetConfig === 'object' && widgetConfig !== null
}
