import {
  defineComponent,
  ref,
  reactive,
  h,
  provide,
  withModifiers,
  useAttrs,
  type PropType
} from 'vue'
import { ContextSymbol } from '../shared/context'
import { getComponentByType, getMappingProp } from '../utils'
import SchemaField from './SchemaField'
import type { PresetConfig, Schema } from '../types'
import { SchemaKeys } from '../shared'

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
    },
    model: {
      type: Object
    }
  },
  inheritAttrs: true,
  setup(props, { expose, slots }) {
    const formRef = ref(null)

    // todo 初始化
    const formData = reactive({})

    expose({
      getFormInstance: () => formRef.value,
      getFormData: () => props.model || formData
    })

    provide(ContextSymbol, {
      schema: props.schema,
      formData: props.model || formData,
      config: props.config
    })

    // 获取表单组件, 如: el-form
    const { component: Form, presetProps } = getComponentByType(
      props.config,
      'form'
    )

    // 表单数据绑定的key, 如: model
    const modelProp = getMappingProp(props.config, 'form', 'model', 'model')

    const attrs = useAttrs()

    return () =>
      h(
        Form,
        {
          ...presetProps,
          ...props.schema[SchemaKeys.FormProps],
          ref: formRef,
          [modelProp]: props.model || formData,
          onSubmit: withModifiers(
            (e) => {
              e.preventDefault()
            },
            ['native']
          )
        },
        () => [
          h(SchemaField, {
            schema: reactive(props.schema)
          }),
          // 默认插槽
          slots.default?.()
        ]
      )
  }
})
