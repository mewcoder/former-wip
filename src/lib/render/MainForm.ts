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
import { getComponentByType, getMappingProp } from '../utils'
import ObjectField from './ObjectField'
import type { PresetConfig, Schema } from '../types'

export default defineComponent({
  name: 'MainForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    widgetsConfig: {
      type: Object as PropType<PresetConfig>,
      default: () => ({}),
      required: true
    }
  },
  inheritAttrs: true,
  setup(props, { expose, slots }) {
    const formRef = ref(null)
    const formData = reactive({})

    const { component: Form, presetProps } = getComponentByType(
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
          h(ObjectField, {
            schema: props.schema,
            showWrapper: false
          }),
          slots.default && slots.default()
        ]
      )
  }
})
