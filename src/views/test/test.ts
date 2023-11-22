import { defineComponent, h } from 'vue'
export default defineComponent({
  name: 'RenderTest',
  props: {
    num: {
      type: Number,
      required: true
    }
  },
  inheritAttrs: false,
  setup(props) {
    console.log('-----------', props.num)

    const render = () => h('div', {}, [props.num])
    const render2 = () => h('div', {}, [props.num])

    // 这样是可以渲染的
    if (props.num % 2 === 0) {
      return () => render()
    }
    return () => render2()

    // return () => render(props.num)
  }
})

// function render(num) {
//   return num % 2 === 0 ? h('div', {}, ['hello']) : h('div', {}, ['world'])
// }
