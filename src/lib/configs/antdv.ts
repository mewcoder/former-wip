import { type WidgetsConfig } from '../types'

const config: WidgetsConfig = {
  widgets: {
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
        prop: 'name'
      }
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

export default config
