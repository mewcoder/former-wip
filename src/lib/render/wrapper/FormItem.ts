import { defineComponent, h, inject, type PropType } from 'vue'
import { ContextSymbol, defaultCtx } from '../../shared/context'
import { getComponentByType, getMappingProp, getRules } from '../../utils'
import type { Schema } from '../../types'

export default defineComponent({
  name: 'FormItemWrapper',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    prop: {
      type: String
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    wrap: {
      type: Boolean,
      default: true
    }
  },
  inheritAttrs: false,
  setup(props, { slots }) {
    const ctx = inject(ContextSymbol, defaultCtx)

    // form-item
    const { component: FormItem, presetProps } = getComponentByType(
      ctx.config,
      'form-item'
    )

    // form-item prop的属性
    const propKey = getMappingProp(ctx.config, 'form-item', 'prop', 'prop')

    // form-item prop的数据类型  数组或字符串
    const propType = getMappingProp(
      ctx.config,
      'form-item',
      'propType',
      'string'
    )

    return () => {
      const rules = getRules(props.schema)
      return props.wrap
        ? h(
            FormItem,
            {
              ...presetProps,
              label: props.showTitle ? props.schema.title : undefined,
              rules,
              ...(props.prop && {
                [propKey]: getPropPath(props.prop, propType)
              })
            },
            () => slots.default?.()
          )
        : () => slots.default?.()
    }
  }
})

// 获取form-item 传入的路径 某些组件库要求是数组
function getPropPath(prop: string, propType: string) {
  if (propType === 'array') return prop ? prop.split('.') : []
  return prop
}
