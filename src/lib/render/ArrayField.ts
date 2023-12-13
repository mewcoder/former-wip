import { defineComponent, inject, h, ref, type PropType } from 'vue'
import SchemaField from './SchemaField'
import type { Schema } from '../types'
import { ContextSymbol, defaultCtx } from '../shared/context'
import { getComponent, getValue } from '../utils'

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
    },
    prop: {
      type: String
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, defaultCtx)

    const list = ref<any[]>([])

    const add = () => list.value.push(Math.random())

    const remove = (i: number) => {
      list.value.splice(i, 1)
      getValue(ctx.formData, props.basePath)?.splice(i, 1)
    }

    const { component: ArrayWrapper, presetProps } = getComponent(
      ctx.config,
      props.schema,
      'array-base'
    )

    function getSchema(schema: Schema, showTitle: boolean) {
      if (!showTitle && schema.title) {
        delete schema.title
      }
      return schema
    }

    return () =>
      h(
        // @ts-ignore
        ArrayWrapper,
        {
          schema: props.schema,
          prop: props.prop,
          ...presetProps,
          list: list.value,
          operations: {
            add,
            remove
          }
        },
        {
          field: ({ prop, showTitle = true }) =>
            h(SchemaField, {
              schema: getSchema(props.schema.items || {}, showTitle),
              basePath: props.basePath,
              prop,
              showObjectWrapper: false
            })
        }
      )
  }
})
