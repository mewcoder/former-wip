import { defineComponent, h, inject, type PropType } from 'vue'
import { ContextSymbol, defaultCtx } from '../../shared/context'
import { getComponentByType, isObjectField, isArrayField } from '../../utils'
import type { Schema } from '../../types'
import { SchemaKeys } from '../../shared'

export default defineComponent({
  name: 'GridWrapper',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    type: {
      type: String as PropType<'row' | 'col'>,
      required: true
    },
    wrap: {
      type: Boolean,
      default: true
    }
  },
  inheritAttrs: false,
  setup(props, { slots }) {
    const ctx = inject(ContextSymbol, defaultCtx)

    const { component: Grid, presetProps: presetProps } = getComponentByType(
      ctx.config,
      props.type
    )

    return () => {
      // 嵌套数组和对象 默认100% 宽度
      const spanConfig =
        props.type === 'col' &&
        (isObjectField(props.schema) || isArrayField(props.schema))
          ? {
              span: 24
            }
          : {}

      return props.wrap
        ? h(
            Grid,
            {
              ...presetProps,
              ...spanConfig,
              ...props.schema[SchemaKeys.GridProps]
            },
            () => slots.default?.()
          )
        : () => slots.default?.()
    }
  }
})
