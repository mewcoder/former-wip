import {
  defineComponent,
  ref,
  reactive,
  h,
  provide,
  withModifiers,
  type PropType
} from 'vue'
import { ContextSymbol } from '../shared/context'
import { getComponent, getMappingProp } from '../utils'
import SchemaField from './SchemaField'
import type { WidgetsConfig, Schema } from '../types'

export default defineComponent({
  name: 'MainForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      require: true
    },
    widgetsConfig: {
      type: Object as PropType<WidgetsConfig>,
      default: () => ({}),
      require: true
    }
  },
  inheritAttrs: true,
  setup(props, { expose, slots }) {
    const formRef = ref(null)
    const formData = reactive({})

    const { Component: Form, presetProps } = getComponent(
      'form',
      props.widgetsConfig
    )

    expose({
      getFormInstance: () => formRef.value,
      getFormData: () => formData
    })

    provide(ContextSymbol, {
      schema: props.schema,
      formData,
      config: props.widgetsConfig
    })

    const modelProp = getMappingProp(
      props.widgetsConfig,
      'form',
      'model',
      'model'
    )

    return () =>
      h(
        Form,
        {
          ...presetProps,
          ref: formRef,
          [modelProp]: formData,
          onSubmit: withModifiers(
            (e) => {
              e.preventDefault()
            },
            ['native']
          )
        },
        () => [
          h(SchemaField, {
            schema: props.schema,
            showFormItem: false,
            showWrapper: false
          }),
          slots.default && slots.default()
        ]
      )
  }
})
