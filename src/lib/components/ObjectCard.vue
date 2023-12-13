<template>
  <div class="object-card">
    <div class="object-card__title">{{ schema.title }}</div>
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
.object-card {
  padding: 18px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  flex: 1;
  margin-bottom: 18px;
}

.object-card__title {
  height: 40px;
  font-size: 16px;
}
</style>
