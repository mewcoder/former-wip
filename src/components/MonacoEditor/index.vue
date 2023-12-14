<template>
  <div ref="editorRef" id="edit-container"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, useAttrs } from 'vue'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    return new editorWorker()
  }
}

const editorRef = ref()

let monacoEditor: any = null

watch(
  () => props.modelValue,
  (value) => {
    // 防止改变编辑器内容时光标重定向
    if (value !== monacoEditor?.getValue()) {
      monacoEditor.setValue(value)
    }
  }
)

const attrs = useAttrs()

onMounted(() => {
  monacoEditor = monaco.editor.create(editorRef.value, {
    value: props.modelValue,
    readOnly: false,
    language: 'json',
    theme: 'vs',
    selectOnLineNumbers: true,
    automaticLayout: true,
    ...attrs
  })
  // 监听值变化
  monacoEditor.onDidChangeModelContent(() => {
    const currenValue = monacoEditor?.getValue()
    emit('update:modelValue', currenValue)
  })
})

function scrollToTop() {
  monacoEditor?.setScrollPosition({ scrollTop: 0 })
}

defineExpose({ scrollToTop })
</script>

<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<style scoped>
#edit-container {
  height: 100%;
}
</style>
