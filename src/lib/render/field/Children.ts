import { defineComponent, h, inject, Fragment, type PropType } from 'vue'
import { ContextSymbol, defaultCtx } from '../../shared/context'
import { getComponent } from '../../utils'
import type { WidgetChildrenItem } from '../../types'
import { SchemaKeys } from '../../shared'

const WidgetChildren = defineComponent({
  name: 'WidgetChildren',
  props: {
    children: {
      type: Array as PropType<(WidgetChildrenItem | string)[]>,
      required: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    const ctx = inject(ContextSymbol, defaultCtx)

    return () =>
      props.children.map((item) => {
        // 字符串直接渲染
        if (typeof item === 'string') {
          return h(Fragment, null, [item])
        } else if (isChildrenItem(item)) {
          const { component: WidgetChild, presetProps } = getComponent(
            ctx.config,
            item
          )
          return h(
            WidgetChild,
            { ...presetProps, ...item[SchemaKeys.WidgetProps] },
            () =>
              item[SchemaKeys.WidgetChildren] &&
              h(WidgetChildren, { children: item[SchemaKeys.WidgetChildren] })
          )
        }
        return null
      })
  }
})

function isChildrenItem(
  item: WidgetChildrenItem | string
): item is WidgetChildrenItem {
  return typeof item === 'object' && item !== null
}

export default WidgetChildren
