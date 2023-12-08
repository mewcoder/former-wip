import {
  ref,
  watch,
  computed,
  defineComponent,
  h,
  inject,
  type Component,
  type PropType
} from 'vue'
import { ContextSymbol } from '../shared/context'
import {
  getComponentByType,
  getMappingProp,
  getRules,
  parseExpression,
  isExpression
} from '../utils'
import BasicField from './BasicField'
import ObjectField from './ObjectField'
import ArrayField from './ArrayField'
import type { Schema } from '../types'
import { SchemaKeys } from '../shared'

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
      default: '' // 根对象时为空
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
      return getProp(props.basePath, props.prop)
    })

    const renderField = () =>
      h(Field, {
        schema: props.schema,
        basePath: props.prop ? [...props.basePath, props.prop] : [...props.basePath],
        prop: prop.value,
        showWrapper: props.showWrapper
      })

    const hidden = ref(false)

    const deps = props.schema.dependencies

    if (deps) {
      watch(
        deps.map((path) => () => ctx.formData[path]),
        () => {
          console.log('watch deps change', deps)
          let hid = false
          const val = props.schema[SchemaKeys.Hidden]
          if (val) {
            if (isExpression(val)) {
              hid = parseExpression(val, ctx.formData, deps)
            } else {
              hid = true
            }
          } else {
            hid = false
          }
          hidden.value = hid
        }
      )
    }
    return () => {
      if (hidden.value) return null
      else {
        // 包裹 FormItem // 对象和数组可能不需要包裹
        if (props.showFormItem && props.prop) {
          const { component: Col, presetProps: colPresetProps } =
            getComponentByType(ctx.config, 'col')

          // 嵌套数组和对象 占位
          const spanConfig = isNest.value ? { span: 24 } : {}

          const { component: FormItem, presetProps } = getComponentByType(
            ctx.config,
            'form-item'
          )

          const propKey = getMappingProp(
            ctx.config,
            'form-item',
            'prop',
            'prop'
          )

          // prop 路径的数据类型  数组或字符串
          const propType = getMappingProp(
            ctx.config,
            'form-item',
            'propType',
            'string'
          )

          const rules = getRules(props.schema)

          return h(
            Col,
            {
              ...colPresetProps,
              ...spanConfig,
              ...props.schema[SchemaKeys.GridProps]
            },
            () =>
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
          return renderField()
        }
      }
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

// 获取全路径 a.b.c
function getProp(basePath: string[], prop: string) {
  return prop && basePath.length > 0 ? `${basePath.join('.')}.${prop}` : prop
}

// 获取form-item 传入的路径 某些组件库要求是数组
function getPropPath(prop: string, propType: string) {
  if (propType === 'array') return prop ? prop.split('.') : []
  return prop
}
