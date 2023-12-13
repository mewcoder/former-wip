import ObjectBase from '../components/ObjectBase.vue'
import ObjectCard from '../components/ObjectCard.vue'
import ArrayBase from '../components/ArrayBase.vue'
import ArrayBasic from '../components/ArrayBasic.vue'
import ArrayTable from '../components/ArrayTable.vue'


export default {
  widgets: {
    'object-base': ObjectBase,
    'object-card': ObjectCard,
    'array-base': ArrayBase,
    'array-basic': ArrayBasic,
    'array-table': ArrayTable,
    'form': {
      widget: 'el-form',
      props: {
        'label-position': 'top'
      }
    },
    'form-item': 'el-form-item',
    'row': {
      widget: 'el-row',
      props: {
        gutter: 16
      }
    },
    'col': {
      widget: 'el-col',
      props: {
        span: 12
      }
    },
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
      props: {
        placeholder: '请选择'
      },
      generateChildren: (options) => getSelectChildren(options, 'el-option')
    },
    'multi-select': {
      widget: 'el-select',
      props: { placeholder: '请选择', multiple: true },
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

// todo
function getSelectChildren(options, widget) {
  return options.map((item) => ({
    'ui-widget': widget,
    'ui-props': { label: item.label, value: item.value }
  }))
}

function getGroupChildren(options, widget) {
  return options.map((item) => ({
    'ui-widget': widget,
    'ui-props': { label: item.value },
    'ui-children': [item.label]
  }))
}
