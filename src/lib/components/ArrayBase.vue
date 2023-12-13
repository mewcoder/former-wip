<template>
  <FormItemWrapper :schema="schema" :prop="prop">
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
        <slot :prop="i + ''" :show-title="false"></slot>
      </div>
      <el-button class="array-add" @click="handleAdd">添加</el-button>
    </div>
  </FormItemWrapper>
</template>
<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Schema } from '../types'
import { FormItemWrapper } from '../index'

export default defineComponent({
  name: 'ArrayBase',
  components: { FormItemWrapper },
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    prop: {
      type: String
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
  setup(props) {
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
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  flex: 1;
  color: #606266;
}

.array-item {
  margin-bottom: 12px;
  position: relative;
  border: 1px solid #d9d9d9;
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
