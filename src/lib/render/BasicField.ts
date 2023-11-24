import {
  defineComponent,
  computed,
  h,
  inject,
  Fragment,
  type PropType
} from 'vue'
import { ContextSymbol } from '../shared/context'
import {
  getComponent,
  getValue,
  setValue,
  getMappingProp,
  getChildren
} from '../utils'
import type { WidgetChildrenItem } from '../types'
import { SchemaKeys } from '../shared'

export default defineComponent({
  name: 'BasicField',
  props: {
    // 表单key值
    prop: {
      type: String,
      required: true
    },
    // 表单项 Schema
    schema: {
      type: Object as PropType<any>,
      required: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, {})

    const { component: Widget, presetProps } = getComponent(
      props.schema,
      ctx.config
    )

    const modelProp = getMappingProp(
      ctx.config,
      props.schema[SchemaKeys.WidgetType],
      'model',
      ctx.config?.defaultModelProp || 'modelValue'
    )

    const modelValue = computed({
      get() {
        return getValue(ctx.formData, props.prop)
      },
      set(val) {
        setValue(ctx.formData, props.prop, val)
      }
    })

    const children = getChildren(props.schema, ctx.config)

    return () =>
      h(
        Widget,
        {
          ...presetProps,
          ...props.schema[SchemaKeys.WidgetProps],
          [modelProp]: modelValue.value,
          [`onUpdate:${modelProp}`]: ($event: any) => {
            modelValue.value = $event
          }
        },
        () => children?.length && h(WidgetChildren, { children: children })
      )
  }
})

const WidgetChildren = defineComponent({
  name: 'WidgetChildren',
  props: {
    children: {
      type: Array as PropType<(WidgetChildrenItem | string)[]>,
      required: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, {})

    return () =>
      props.children.map((item) => {
        // 字符串直接渲染
        if (typeof item === 'string') {
          return h(Fragment, null, [item])
        } else if (isChildrenItem(item)) {
          const { component: WidgetChild, presetProps } = getComponent(
            item,
            ctx.config
          )

          return h(
            WidgetChild,
            { ...presetProps, ...item[SchemaKeys.WidgetProps] },
            () =>
              item[SchemaKeys.WidgetChildren] &&
              h(WidgetChildren, { children: item[SchemaKeys.WidgetChildren] })
          )
        }
        return null
      })
  }
})

function isChildrenItem(
  item: WidgetChildrenItem | string
): item is WidgetChildrenItem {
  return typeof item === 'object' && item !== null
}
