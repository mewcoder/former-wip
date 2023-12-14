import {
  watch,
  computed,
  defineComponent,
  h,
  inject,
  type Component,
  type PropType,
  reactive
} from 'vue'
import { ContextSymbol, defaultCtx } from '../shared/context'
import {
  isEmptyField,
  isObjectField,
  isArrayField,
  isVoidField,
  parseExpression,
  isExpression,
  getPath,
  setValue,
  cloneDeep
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
      Field = VoidField // 纯UI组件
    } else {
      Field = BasicField // 普通表单项
    }

    const path = computed(() => {
      return getPath(props.path, props.prop)
    })

    const currentSchema = reactive(cloneDeep(props.schema))

    const deps = props.schema.dependencies

    if (deps) {
      const linkMap: Record<string, string> = getLinkMap(props.schema)
      console.log('linkMap', linkMap)
      watch(
        deps.map((path) => () => ctx.formData[path]),
        (val) => {
          console.log('deps change', val)
          Object.entries(linkMap).forEach(([p, exp]) => {
            setValue(currentSchema, p, parseExpression(exp, ctx.formData, deps))
          })
        },
        {
          immediate: true
        }
      )
    }

    return () => {
      if (currentSchema[SchemaKeys.Hidden]) return null
      return h(Field, {
        schema: currentSchema,
        path: path.value,
        prop: path.value.join('.'),
        ...attrs
      })
    }
  }
})

function getLinkMap(schema) {
  const result = {}

  const traverse = (schema, map, lastPath = '') => {
    Object.entries(schema).forEach(([key, val]) => {
      const path = lastPath ? `${lastPath}.${key}` : key
      if (typeof val === 'object' && key.startsWith('ui')) {
        traverse(val, map, path)
      } else if (isExpression(val)) {
        map[path] = val
      }
    })
  }

  traverse(schema, result)

  return result
}
