import type { WidgetsConfig, Option } from '../types'

const config: WidgetsConfig = {
  widgets: {
    'form': {
      widget: 'el-form',
      props: {
        'label-position': 'top'
      }
    },
    'form-item': 'el-form-item',
    'input': 'el-input',
    'textarea': {
      widget: 'el-input',
      props: {
        type: 'textarea'
      }
    },
    'input-number': 'el-input-number',
    'select': {
      widget: 'el-select',
      generateChildren: (options) => getSelectChildren(options, 'el-option')
    },
    'multi-select': {
      widget: 'el-select',
      props: {
        multiple: true
      },
      generateChildren: (options) => getSelectChildren(options, 'el-option')
    },
    'radio-group': {
      widget: 'el-radio-group',
      generateChildren: (options) => getGroupChildren(options, 'el-radio')
    },
    'checkbox-group': {
      widget: 'el-checkbox-group',
      generateChildren: (options) => getGroupChildren(options, 'el-checkbox')
    },
    'checkbox': 'el-checkbox',
    'switch': 'el-switch'
  }
}

function getSelectChildren(options: Option[], widget: string) {
  return options.map((item) => ({
    widget,
    props: { label: item.label, value: item.value }
  }))
}

function getGroupChildren(options: Option[], widget: string) {
  return options.map((item) => ({
    widget,
    props: { label: item.value },
    children: [item.label]
  }))
}

export default config
