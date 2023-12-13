import { defineComponent, inject, h, type PropType } from 'vue'
import SchemaField from './SchemaField'
import type { Schema } from '../types'
import { getComponent, getOrderProperties } from '../utils'
import GridWrapper from './wrapper/Grid'
import { ContextSymbol, defaultCtx } from '../shared/context'
import { SchemaKeys } from '../shared'

export default defineComponent({
  name: 'ObjectField',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    basePath: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    prop: {
      type: String,
    },
    /**
     * 是否显示对象容器，两种情况不需要：
     * 1.根对象
     * 2.数组对象
     */
    showObjectWrapper: {
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
                basePath: props.basePath,
                prop: key
              })
            )
          )
        )
      }

      if (props.showObjectWrapper) {
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

      return renderFields()
    }
  }
})
