import { defineComponent, h, inject, type PropType } from 'vue'
import { ContextSymbol, defaultCtx } from '../../shared/context'
import { getComponent, getChildren } from '../../utils'
import WidgetChildren from './Children'
import { SchemaKeys } from '../../shared'

import type { Schema } from '../../types'

export default defineComponent({
  name: 'VoidField',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    path: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    prop: {
      type: String,
      default: ''
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, defaultCtx)

    const { component: Widget, presetProps } = getComponent(
      ctx.config,
      props.schema
    )

    const children = getChildren(ctx.config, props.schema)

    return () =>
      h(
        Widget,
        {
          ...presetProps,
          ...props.schema[SchemaKeys.WidgetProps]
        },
        children.length && h(WidgetChildren, { children: children })
      )
  }
})
