<template>
  <main style="padding: 20px 100px">
    <el-form :model="form">
      <el-form-item label="输入框">
        <el-input v-model="form.key01" />
      </el-form-item>
      <el-form-item label="选择框">
        <el-select v-model="form.key02">
          <el-option label="早" value="a" />
          <el-option label="中" value="b" />
          <el-option label="晚" value="c" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>

    <!-- <a-switch v-model:checked="val1"></a-switch> -->

    <a-input-number v-model:value="val1"></a-input-number>
    <Test :num="val1"></Test>
  </main>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import Test from './test.ts'

const form = reactive({
  key01: '',
  key02: ''
})

const val1 = ref(1)

const onSubmit = () => {
  console.log('submit:', JSON.stringify(form, null, 2))
}
</script>
