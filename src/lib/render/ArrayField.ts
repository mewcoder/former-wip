import { defineComponent, inject, h, ref, type PropType } from 'vue'
import SchemaField from './SchemaField'
import type { Schema } from '../types'
import { ContextSymbol } from '../shared/context'
import ArrayBase from '../components/ArrayBase.vue'
import { getValue } from '../utils'

export default defineComponent({
  name: 'ArrayField',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    basePath: {
      type: Array as PropType<string[]>,
      required: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, {})

    const list = ref<any[]>([])

    const add = () => list.value.push(Math.random())

    const remove = (i: number) => {
      console.log(i, list.value)
      list.value.splice(i, 1)
      getValue(ctx.formData, props.basePath).splice(i, 1)
    }

    return () =>
      h(
        ArrayBase,
        {
          schema: props.schema,
          list: list.value,
          opreates: {
            add,
            remove
          }
        },
        {
          field: ({ prop }) =>
            h(SchemaField, {
              schema: props.schema.items || {},
              basePath: props.basePath,
              prop: prop + '',
              showWrapper: false,
              showFormItem: false
            })
        }
      )
  }
})
