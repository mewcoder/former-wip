import { defineComponent, inject, h, ref, type PropType } from 'vue'
import SchemaField from '../SchemaField'
import type { Schema } from '../../types'
import { ContextSymbol, defaultCtx } from '../../shared/context'
import { getComponent, getValue } from '../../utils'

export default defineComponent({
  name: 'ArrayField',
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
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, defaultCtx)

    const list = ref<any[]>([])

    const add = () => list.value.push(Math.random())

    const remove = (i: number) => {
      list.value.splice(i, 1)
      getValue(ctx.formData, props.path)?.splice(i, 1)
    }

    const { component: ArrayWrapper, presetProps } = getComponent(
      ctx.config,
      props.schema,
      'array-base'
    )

    return () =>
      h(
        // @ts-ignore
        ArrayWrapper,
        {
          schema: props.schema,
          prop: props.prop,
          path: props.path,
          ...presetProps,
          list: list.value,
          operations: {
            add,
            remove
          }
        },

        ({ prop }) =>
          h(SchemaField, {
            schema: props.schema.items || {},
            path: props.path,
            prop,
            showTitle: false,
            showWrapper: false
          })
      )
  }
})
