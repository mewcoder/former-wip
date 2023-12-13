import { defineComponent, inject, h, type PropType } from 'vue'
import SchemaField from '../SchemaField'
import type { Schema } from '../../types'
import { getComponent, getOrderProperties } from '../../utils'
import GridWrapper from '../wrapper/Grid'
import { ContextSymbol, defaultCtx } from '../../shared/context'
import { SchemaKeys } from '../../shared'

export default defineComponent({
  name: 'ObjectField',
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
    showWrapper: {
      type: Boolean,
      default: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, defaultCtx)

    return () => {
      const renderFields = () => {
        return h(GridWrapper, { schema: props.schema, type: 'row' }, () =>
          getOrderProperties(props.schema).map(({ key, schema }) =>
            h(GridWrapper, { schema: schema, type: 'col' }, () =>
              h(SchemaField, {
                schema: schema,
                path: props.path,
                prop: key
              })
            )
          )
        )
      }
      // 根对象时为空，不需要 wrapper
      if (!props.prop || !props.showWrapper) return renderFields()

      const { component: ObjectWrapper, presetProps } = getComponent(
        ctx.config,
        props.schema,
        'object-base'
      )

      return h(
        ObjectWrapper,
        {
          schema: props.schema,
          prop: props.prop,
          ...presetProps,
          ...props.schema[SchemaKeys.WidgetProps]
        },
        () => renderFields()
      )
    }
  }
})
