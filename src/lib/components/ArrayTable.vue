<template>
  <FormItemWrapper :schema="schema" :prop="prop">
    <div class="array-table">
      <el-table :data="list" empty-text="暂无数据">
        <el-table-column label="序号" width="60px">
          <template #default="scope">{{ scope.$index }} </template>
        </el-table-column>
        <el-table-column
          v-for="item in orderProperties"
          :key="item.key"
          :label="item.schema.title"
        >
          <template #default="scope">
            <SchemaField
              :schema="item.schema"
              :path="path"
              :prop="`${scope.$index}.${item.key}`"
              :show-title="false"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template #default="scope">
            <el-button link type="primary" @click="handleRemove(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="array-add" @click="handleAdd">添加</el-button>
    </div>
  </FormItemWrapper>
</template>
<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import type { Schema } from '../types'
import { FormItemWrapper } from '../index'
import { getOrderProperties } from '../utils'
import { SchemaField } from '../index'

export default defineComponent({
  name: 'ArrayBase',
  components: { FormItemWrapper, SchemaField },
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true
    },
    path: {
      type: Array as PropType<string[]>,
      default: () => []
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
    const orderProperties = computed(() => {
      return getOrderProperties(props.schema?.items || {})
    })

    function handleRemove(index: number) {
      props.operations?.remove(index)
    }

    function handleAdd() {
      props.operations?.add()
    }
    return {
      orderProperties,
      handleAdd,
      handleRemove
    }
  }
})
</script>
<style scoped>
.array-table {
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
:deep(.el-table .cell > :first-child) {
  margin: 0;
}
</style>
