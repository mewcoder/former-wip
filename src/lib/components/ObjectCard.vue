<template>
  <div class="vf-object-base">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Schema } from '../types'

export default defineComponent({
  name: 'ObjectCard',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    }
  },
  inheritAttrs: false
})
</script>
<style scoped>
.vf-object-base {
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  flex: 1;
}
</style>
