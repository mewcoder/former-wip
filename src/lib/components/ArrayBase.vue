<template>
  <div class="array-base">
    <div v-for="(key, i) in list" :key="key" class="array-item">
      <div class="field__header">
        <div class="filed__title">{{ '#' + (i + 1) }}</div>
        <div class="filed__operate">
          <el-button
            link
            type="primary"
            class="array-remove"
            @click="handleRemove(i)"
          >
            删除
          </el-button>
        </div>
      </div>
      <slot name="field" :prop="i"></slot>
    </div>
    <el-button class="array-add" @click="handleAdd">添加</el-button>
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Schema } from '../types'

export default defineComponent({
  name: 'ArrayBase',
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    list: {
      type: Array as PropType<any[]>,
      required: true
    },
    operations: {
      type: Object as PropType<any>,
      required: true
    }
  },
  inheritAttrs: false,
  setup(props, { slots }) {
    function handleRemove(index: number) {
      props.operations?.remove(index)
    }

    function handleAdd() {
      props.operations?.add()
    }
    return {
      handleAdd,
      handleRemove
    }
  }
})
</script>
<style scoped>
.array-base {
  padding: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  flex: 1;
  color: #606266;
}

.array-item {
  margin-bottom: 12px;
  position: relative;
  border: 1px solid #dcdfe6;
  padding: 0 12px 12px 12px;
  border-radius: 4px;
}

.field__header {
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.array-add {
  width: 100%;
  border-style: dashed;
}
</style>
