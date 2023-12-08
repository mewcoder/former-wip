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
    /**
     * 是否显示对象容器，两种情况不需要：
     * 1.根对象
     * 2.数组对象
     */
    showObjectWrapper: {
      type: Boolean,
      default: true
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, {})

    const { component: Row, presetProps } = getComponentByType(
      ctx.config,
      'row'
    )

    return () => {
      const renderFieldList = () => {
        return h(Row, { ...presetProps }, () =>
          getOrderProperties(props.schema).map(({ key, schema }) =>
            h(SchemaField, {
              prop: key,
              schema: schema,
              basePath: props.basePath,
              showTitle: props.showTitle
            })
          )
        )
      }

      if (!props.showObjectWrapper) {
        return renderFieldList()
      }
      return h(ObjectBox, { schema: props.schema }, () => renderFieldList())
    }
  }
})
