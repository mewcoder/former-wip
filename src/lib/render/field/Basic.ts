import { defineComponent, computed, h, inject, type PropType } from 'vue'
import { ContextSymbol, defaultCtx } from '../../shared/context'
import {
  getComponent,
  getValue,
  setValue,
  getMappingProp,
  getChildren
} from '../../utils'
import WidgetChildren from './Children'
import { SchemaKeys } from '../../shared'
import FormItemWrapper from '../wrapper/FormItem'
import type { Schema } from '../../types'

export default defineComponent({
  name: 'BasicField',
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

    const modelProp = getMappingProp(
      ctx.config,
      props.schema[SchemaKeys.WidgetType],
      'model',
      // @ts-ignore
      ctx.config?.defaultModelProp || 'modelValue'
    )

    const modelValue = computed({
      get() {
        return getValue(ctx.formData, props.prop)
      },
      set(val) {
        setValue(ctx.formData, props.prop, val)
      }
    })

    const children = getChildren(ctx.config, props.schema)

    return () =>
      h(
        FormItemWrapper,
        { schema: props.schema, prop: props.prop, showTitle: props.showTitle },
        () =>
          h(
            Widget,
            {
              ...presetProps,
              ...props.schema[SchemaKeys.WidgetProps],
              [modelProp]: modelValue.value,
              [`onUpdate:${modelProp}`]: ($event: any) => {
                modelValue.value = $event
              }
            },
            () => h(WidgetChildren, { children: children })
          )
      )
  }
})
