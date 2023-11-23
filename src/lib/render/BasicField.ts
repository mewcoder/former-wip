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
  generateChildren
} from '../utils'
import type { ChildrenItem } from '../types'

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
      props.schema['ui-widget'],
      ctx.config,
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

    const children = generateChildren(props.schema, ctx.config)

    return () =>
      h(
        Widget,
        {
          ...presetProps,
          ...props.schema['ui-props'],
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
      type: Array as PropType<(ChildrenItem | string)[]>,
      required: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, {})

    return () =>
      props.children.map((item) => {
        if (typeof item === 'string') {
          return h(Fragment, null, [item]) // 字符串渲染
        } else if (isChildrenItem(item)) {
          const { component: WidgetChild, presetProps } = getComponent(
            item,
            ctx.config
          )

          return h(
            WidgetChild,
            { ...presetProps, ...item['ui-props'] },
            () =>
              item.children &&
              h(WidgetChildren, { children: item['ui-children'] })
          )
        }
        return null
      })
  }
})

function isChildrenItem(item: ChildrenItem | string): item is ChildrenItem {
  return typeof item === 'object' && item !== null
}
