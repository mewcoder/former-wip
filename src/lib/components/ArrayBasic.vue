<template>
  <FormItemWrapper :schema="schema" :prop="prop">
    <div class="array-base">
      <div v-for="(key, i) in list" :key="key" class="array-item">
        <slot  :prop="i + ''" :show-title="false"></slot>
        <el-button
          link
          type="primary"
          @click="handleRemove(i)"
          class="array-remove"
        >
          删除
        </el-button>
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
    list: {
      type: Array as PropType<any[]>,
      required: true
    },
    prop: {
      type: String,
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
  padding: 18px;
  background-color: #f5f5f5;
  border-radius: 4px;
  flex: 1;
  color: #606266;
}

.array-item {
  margin-bottom: 18px;
  display: flex;
}

.array-item > :first-child {
  flex: 1;
}
.array-remove {
  width: 32px;
  padding-left: 8px;
}

.array-add {
  width: calc(100% - 32px);
  border-style: dashed;
}
</style>
