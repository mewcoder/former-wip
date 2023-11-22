import {
  computed,
  defineComponent,
  h,
  inject,
  type Component,
  type PropType
} from 'vue'
import { ContextSymbol } from '../shared/context'
import { getComponent, getMappingProp } from '../utils'
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
      default: ''
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

    const prop = computed(() => {
      if (isObjectField(props.schema) || isArrayField(props.schema))
        return undefined
      return getProp(props.basePath, props.prop)
    })

    const renderField = () =>
      h(Field, {
        schema: props.schema,
        basePath: props.prop ? [...props.basePath, props.prop] : props.basePath,
        prop: prop.value,
        showWrapper: props.showWrapper
      })

    // 包裹 FormItem
    if (props.showFormItem) {
      const { Component: FormItem, presetProps } = getComponent(
        'form-item',
        ctx.config
      )
      const propKey = getMappingProp(ctx.config, 'form-item', 'prop', 'prop')

      return () =>
        h(
          FormItem,
          {
            ...presetProps,
            label: props.schema.title,
            [propKey]: prop.value
          },
          () => renderField()
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
