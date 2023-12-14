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
  isVoidField,
  parseExpression,
  isExpression,
  getPath
} from '../utils'
import { BasicField, ObjectField, ArrayField, VoidField } from './field'
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
    path: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    prop: {
      type: String, // 对象的key 或 数组的下标
      default: ''
    }
  },
  inheritAttrs: false,
  setup(props, { attrs }) {
    const ctx = inject(ContextSymbol, defaultCtx)

    if (isEmptyField(props.schema)) return () => null

    let Field: Component
    if (isObjectField(props.schema)) {
      Field = ObjectField // 嵌套对象
    } else if (isArrayField(props.schema)) {
      Field = ArrayField // 嵌套数组
    } else if (isVoidField(props.schema)) {
      Field = VoidField // UI组件
    } else {
      Field = BasicField // 普通表单项
    }

    const path = computed(() => {
      return getPath(props.path, props.prop)
    })

    const hidden = ref(false)

    // 联动
    const deps = props.schema.dependencies

    if (deps) {
      watch(
        deps.map((path) => () => ctx.formData[path]),
        () => {
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
        path: path.value,
        prop: path.value.join('.'),
        ...attrs
      })
    }
  }
})
