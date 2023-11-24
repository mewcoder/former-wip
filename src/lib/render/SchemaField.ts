import {
  computed,
  defineComponent,
  h,
  inject,
  type Component,
  type PropType
} from 'vue'
import { ContextSymbol } from '../shared/context'
import { getComponentByType, getMappingProp, getRules } from '../utils'
import BasicField from './BasicField'
import ObjectField from './ObjectField'
import ArrayField from './ArrayField'
import type { Schema } from '../types'

// 递归渲染
export default defineComponent({
  name: 'SchemaField',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    prop: {
      type: String,
      required: true
    },
    basePath: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    showFormItem: {
      type: Boolean,
      default: true
    },
    // 是否显示容器 嵌套时会用到
    showWrapper: {
      type: Boolean,
      default: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, {})

    if (isEmptyField(props.schema)) return () => null

    let Field: Component
    if (isObjectField(props.schema)) {
      Field = ObjectField // 嵌套对象
    } else if (isArrayField(props.schema)) {
      Field = ArrayField // 嵌套数组
    } else {
      Field = BasicField // 普通表单项
    }

    const isNest = computed(() => {
      return isObjectField(props.schema) || isArrayField(props.schema)
    })

    const prop = computed(() => {
      if (isObjectField(props.schema) || isArrayField(props.schema))
        return undefined
      return getProp(props.basePath, props.prop)
    })

    const renderField = () =>
      h(Field, {
        schema: props.schema,
        basePath: [...props.basePath, props.prop],
        prop: prop.value,
        showWrapper: props.showWrapper
      })

    // 包裹 FormItem
    if (props.showFormItem) {
      const { component: Col, presetProps: colPresetProps } =
        getComponentByType('col', ctx.config)

      // 嵌套数组和对象 占位
      const spanConfig = isNest.value ? { span: 24 } : {}

      const { component: FormItem, presetProps } = getComponentByType(
        'form-item',
        ctx.config
      )

      const propKey = getMappingProp(ctx.config, 'form-item', 'prop', 'prop')

      const propType = getMappingProp(
        ctx.config,
        'form-item',
        'propType',
        'string'
      )

      const rules = getRules(props.schema)

      return () =>
        h(Col, { ...colPresetProps, ...spanConfig }, () =>
          h(
            FormItem,
            {
              ...presetProps,
              label: props.schema.title,
              rules,
              [propKey]: getPropPath(prop.value, propType)
            },
            () => renderField()
          )
        )
    } else {
      // 直接渲染
      return () => renderField()
    }
  }
})

function isEmptyField(schema: Schema) {
  return !schema || Object.keys(schema).length === 0
}

function isObjectField(schema: Schema) {
  return schema.type === 'object' && schema?.properties
}

function isArrayField(schema: Schema) {
  return schema.type === 'array' && schema?.items
}

function getProp(basePath: string[], prop: string) {
  return prop && basePath.length > 0 ? basePath.join('.') + '.' + prop : prop
}

function getPropPath(prop: string | undefined, propType: string) {
  if (!prop) return
  if (propType === 'array') return prop.split('.')
  return prop
}
