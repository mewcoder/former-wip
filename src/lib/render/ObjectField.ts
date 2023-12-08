import { defineComponent, inject, h, type PropType } from 'vue'
import SchemaField from './SchemaField'
import ObjectBox from '../components/ObjectBase.vue'
import type { Schema } from '../types'
import { getComponentByType, getOrderProperties } from '../utils'
import { ContextSymbol } from '../shared/context'

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
    showWrapper: {
      type: Boolean,
      default: true // 根对象不需要
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, {})

    const { component: Row, presetProps } = getComponentByType(
      ctx.config,
      'row'
    )

    const renderFieldList = () => {
      return h(Row, { ...presetProps }, () =>
        getOrderProperties(props.schema).map(({ key, schema }) =>
          h(SchemaField, {
            prop: key,
            schema: schema,
            basePath: props.basePath
          })
        )
      )
    }

    if (!props.showWrapper) {
      return () => renderFieldList()
    }
    return () => h(ObjectBox, { schema: props.schema }, () => renderFieldList())
  }
})
