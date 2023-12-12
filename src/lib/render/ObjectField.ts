import { defineComponent, h, type PropType } from 'vue'
import SchemaField from './SchemaField'
import ObjectBox from '../components/ObjectBase.vue'
import type { Schema } from '../types'
import { getOrderProperties } from '../utils'
import GridWrapper from './wrapper/Grid'

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
    }
  },
  inheritAttrs: false,
  setup(props) {
    return () => {
      const renderFields = () => {
        return h(GridWrapper, { schema: props.schema, type: 'row' }, () =>
          getOrderProperties(props.schema).map(({ key, schema }) =>
            h(SchemaField, {
              schema: schema,
              basePath: props.basePath,
              prop: key
            })
          )
        )
      }

      return props.showObjectWrapper
        ? h(ObjectBox, { schema: props.schema }, renderFields())
        : renderFields()
    }
  }
})
