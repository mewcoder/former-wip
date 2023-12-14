<template>
  <div class="playground">
    <header class="bar">
      <div class="title">
        <span style="margin-right: 20px">🌌 DynaForm Playground</span>
        <div style="margin-top: 10px">
          <el-radio-group v-model="curJson" size="small">
            <el-radio-button
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              >{{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="ui">
        <div>
          <el-radio-group v-model="curUI">
            <el-radio label="ep">Element Plus</el-radio>
            <el-radio label="antdv">Ant Design Vue</el-radio>
          </el-radio-group>
        </div>
        <div>
          <el-button @click="showDrawer = true">查看数据</el-button>
          <el-button type="danger" @click="forceUpdate">渲染刷新</el-button>
        </div>
      </div>
    </header>
    <main class="container">
      <div id="editor">
        <MonacoEditor ref="editorRef" v-model="jsonStr" />
      </div>
      <div id="preview">
        <SchemaRender
          :key="curUI + refreshKey"
          ref="formRef"
          :schema="schema"
          :config="config"
          :model="data.formData"
          label-position="top"
        >
          <el-button type="primary" @click="submit">提交</el-button>
        </SchemaRender>
      </div>
    </main>
  </div>
  <el-drawer v-if="showDrawer" v-model="showDrawer" title="FormData">
    <MonacoEditor
      v-model="formDataStr"
      :readOnly="true"
      :minimap="{ enabled: false }"
      lineNumbers="off"
    />
  </el-drawer>
</template>
<script lang="ts" setup>
import { ref, shallowRef, computed, watch, onMounted, reactive } from 'vue'
import MonacoEditor from '@/components/MonacoEditor/index.vue'
import json0 from './schema/00.json'
import json1 from './schema/01.json'
import json2 from './schema/02.json'
import json3 from './schema/03.json'
import { SchemaRender } from '@/lib'
import epConfig from '@/lib/presets/element-plus'
import antdvConfig from '@/lib/presets/antdv'
import Split from 'split.js'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()

const route = useRoute()

const jsonList = [json0, json1, json2, json3]

onMounted(() => {
  Split(['#editor', '#preview'], { minSize: 350, gutterSize: 14 })
})

const jsonStr = ref('{}')

const curJson = ref(Number(route.query.json) || 0)

const editorRef = ref()

const refreshKey = ref(0)

const data = reactive({ formData: {} })

watch(
  () => curJson.value,
  (val) => {
    editorRef.value?.scrollToTop()
    jsonStr.value = JSON.stringify(jsonList[val], null, 2)
    forceUpdate()
    router.replace({
      query: {
        ...route.query,
        json: val
      }
    })
  },
  {
    immediate: true
  }
)

const curUI = ref(String(route.query.ui) || 'ep')
const config = shallowRef(epConfig)
watch(
  () => curUI.value,
  (val) => {
    switch (val) {
      case 'ep':
        config.value = epConfig
        break
      case 'antdv':
        config.value = antdvConfig
        break
    }
    router.replace({
      query: {
        ...route.query,
        ui: val
      }
    })
  },
  {
    immediate: true
  }
)

const schema = computed(() => {
  return JSON.parse(jsonStr.value)
})

const formRef = ref()
const showDrawer = ref(false)

const formDataStr = computed(() => {
  console.log(data.formData)
  return JSON.stringify(data.formData, null, 2)
})

const submit = async () => {
  try {
    const valid = await formRef.value.getFormInstance()?.validate()
    if (valid) {
      showDrawer.value = true
    }
  } catch (error) {
    console.log('🚀 ~  error:', error)
  }
}

function forceUpdate() {
  data.formData = {}
  refreshKey.value++
}

const options = [
  {
    value: 0,
    label: '基础表单'
  },
  {
    value: 1,
    label: '嵌套对象'
  },
  {
    value: 2,
    label: '嵌套数组'
  },
  {
    value: 3,
    label: '简单联动'
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
  height: 72px;
  padding: 8px 16px;
  border-bottom: 1px solid darkgray;

  .ui {
    width: 50%;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-left: 16px;
  }
  .title {
    font-weight: 600;
    font-size: 16px;
  }
}

.container {
  height: calc(100% - 72px);
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
