<template>
  <FormItemWrapper :schema="schema" :prop="prop">
    <div class="object-base">
      <slot></slot>
    </div>
  </FormItemWrapper>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Schema } from '../types'
import { FormItemWrapper } from '../index'

export default defineComponent({
  name: 'ObjectBase',
  components: { FormItemWrapper },
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    prop: {
      type: String
    }
  },
  inheritAttrs: false
})
</script>
<style scoped>
.object-base {
  padding: 18px;
  background-color: #f5f5f5;
  border-radius: 4px;
  flex: 1;
}
</style>
