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
import { ContextSymbol, defaultCtx } from '../shared/context'
import {
  isEmptyField,
  isObjectField,
  isArrayField,
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
      default: ''
    },
    basePath: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    showObjectWrapper: {
      type: Boolean,
      default: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, defaultCtx)

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
      return getProp(props.basePath, props.prop)
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

      return h(Field, {
        schema: props.schema,
        basePath: getBasePath(props.basePath, props.prop),
        prop: prop.value,
        showObjectWrapper: props.showObjectWrapper
      })
    }
  }
})

// 获取全路径 a.b.c
function getProp(basePath: string[], prop: string) {
  return prop && basePath.length > 0 ? `${basePath.join('.')}.${prop}` : prop
}

// 拼接路径
function getBasePath(basePath: string[], prop: string) {
  return prop ? [...basePath, prop] : [...basePath]
}
