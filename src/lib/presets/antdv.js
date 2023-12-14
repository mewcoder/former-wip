import components from '../components'

export default {
  widgets: {
    ...components,
    'form': {
      widget: 'a-form',
      props: {
        layout: 'vertical'
      },
      propMapping: {
        model: 'model'
      }
    },
    'form-item': {
      widget: 'a-form-item',
      propMapping: {
        prop: 'name',
        propType: 'array'
      }
    },
    'row': {
      widget: 'el-row',
      props: {
        gutter: 16
      }
    },
    'col': {
      widget: 'el-col'
    },
    'input': 'a-input',
    'textarea': 'a-textarea',
    'input-number': 'a-input-number',
    'select': 'a-select',
    'multi-select': {
      widget: 'a-select',
      props: {
        mode: 'multiple'
      }
    },
    'radio-group': 'a-radio-group',
    'checkbox-group': 'a-checkbox-group',
    'checkbox': {
      widget: 'a-checkbox',
      propMapping: {
        model: 'checked'
      }
    },
    'switch': {
      widget: 'a-switch',
      propMapping: {
        model: 'checked'
      }
    }
  },
  defaultModelProp: 'value' // v-model:value
}
