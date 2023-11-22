<template>
  <div class="playground">
    <header class="bar">
      <div class="title">VueFormer playGround</div>
      <div class="ui">
        <span style="margin-right: 10px">组件库：</span>
        <el-radio-group v-model="curUI" class="ml-4">
          <el-radio label="ep">Element Plus</el-radio>
          <el-radio label="antdv">Ant Design Vue</el-radio>
        </el-radio-group>
      </div>
    </header>
    <main class="container">
      <div class="editor">
        <MonocoEditor v-model="jsonStr" />
      </div>
      <div class="preview">
        <SchemaRender
          :key="curUI"
          ref="formRef"
          :schema="schema"
          :widgets-config="config"
        >
          <el-button type="primary" @click="test">提交</el-button>
        </SchemaRender>
      </div>
    </main>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import MonocoEditor from '@/components/MonacoEditor/index.vue'
import base from './schema/base.json'
import { SchemaRender } from '@/lib'
import epConfig from '@/lib/configs/element-plus'
import antdvConfig from '@/lib/configs/antdv'

const jsonStr = ref(JSON.stringify(base, null, 2))

const schema = computed(() => {
  return JSON.parse(jsonStr.value)
})

const formRef = ref()

const curUI = ref('ep')

const config = computed(() => {
  switch (curUI.value) {
    case 'ep':
      return epConfig
    case 'antdv':
      return antdvConfig
    default:
      return epConfig
  }
})

const test = async () => {
  try {
    const data = formRef.value.getFormData()
    alert(JSON.stringify(data, null, 2))
    console.log('🚀 ~ formRef:', data)
  } catch (error) {
    console.log('🚀 ~  error:', error)
  }
}
</script>

<style lang="scss" scoped>
.playground {
  height: 100vh;
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid darkgray;
  line-height: 50px;

  .ui {
    width: 50%;
  }
  .title {
    font-weight: 500;
  }
}

.container {
  height: calc(100% - 50px);
  display: flex;
  .editor {
    width: 50%;
    height: 100%;
  }

  .preview {
    border-left: 1px solid darkgray;
    width: 50%;
    height: 100%;
    background-color: #fff;
    padding: 24px 48px;
    overflow: auto;
  }
}
</style>
@/lib/configs/element-plus@/lib/configs/antdv
