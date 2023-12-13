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
import SchemaField from './SchemaField'
import type { PresetConfig, Schema } from '../types'

export default defineComponent({
  name: 'MainForm',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    config: {
      type: Object as PropType<PresetConfig>,
      default: () => ({}),
      required: true
    }
  },
  inheritAttrs: true,
  setup(props, { expose, slots }) {
    const formRef = ref(null)

    const formData = reactive({})

    expose({
      getFormInstance: () => formRef.value,
      getFormData: () => formData
    })

    provide(ContextSymbol, {
      schema: props.schema,
      formData,
      config: props.config
    })

    // 获取表单组件, 如: el-form
    const { component: Form, presetProps } = getComponentByType(
      props.config,
      'form'
    )

    // 表单数据绑定的key, 如: model
    const modelProp = getMappingProp(props.config, 'form', 'model', 'model')

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
            schema: props.schema
          }),
          // 默认插槽
          slots.default?.()
        ]
      )
  }
})
