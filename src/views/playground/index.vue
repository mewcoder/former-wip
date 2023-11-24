<template>
  <div class="playground">
    <header class="bar">
      <div class="title">
        <span style="margin-right: 20px">🎮 VueFormer Playground</span>
        <el-select v-model="curJson">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="ui">
        <span style="margin-right: 10px">组件库：</span>
        <el-radio-group v-model="curUI" class="ml-4">
          <el-radio label="ep">Element Plus</el-radio>
          <el-radio label="antdv">Ant Design Vue</el-radio>
        </el-radio-group>
      </div>
    </header>
    <main class="container">
      <div id="editor">
        <MonocoEditor v-model="jsonStr" />
      </div>
      <div id="preview">
        <SchemaRender
          :key="curUI + refreshKey"
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
import { ref, computed, watch, onMounted } from 'vue'
import MonocoEditor from '@/components/MonacoEditor/index.vue'
import test01 from './schema/01.json'
import test02 from './schema/02.json'
import { SchemaRender } from '@/lib'
import epConfig from '@/lib/presets/element-plus'
import antdvConfig from '@/lib/presets/antdv'
import Split from 'split.js'

onMounted(() => {
  Split(['#editor', '#preview'], { minSize: 350, gutterSize: 14 })
})

const jsonStr = ref(JSON.stringify(test01, null, 2))

const curJson = ref('01')

const refreshKey = ref(0)

watch(
  () => curJson.value,
  (val) => {
    switch (val) {
      case '01':
        jsonStr.value = JSON.stringify(test01, null, 2)
        break
      case '02':
        jsonStr.value = JSON.stringify(test02, null, 2)
        break
    }
    refreshKey.value++
  },
  {
    immediate: true
  }
)

const schema = computed(() => {
  return JSON.parse(jsonStr.value)
})

const formRef = ref()

const curUI = ref('antdv')

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
    console.log('🚀 ~ formRef:', data)
    const valid = await formRef.value.getFormInstance()?.validate()
    if (valid) {
      alert(JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.log('🚀 ~  error:', error)
  }
}

const options = [
  {
    value: '01',
    label: '01'
  },
  {
    value: '02',
    label: '02'
  }
]
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
    font-weight: 600;
    font-size: 16px;
  }
}

.container {
  height: calc(100% - 50px);
  display: flex;
  #editor {
    height: 100%;
  }

  #preview {
    z-index: 10;
    height: 100%;
    background-color: #fff;
    padding: 24px 48px;
    overflow: auto;
  }
}
</style>
<style>
.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
  cursor: col-resize;
}
</style>
@/lib/presets/element-plus@/lib/presets/antdv
