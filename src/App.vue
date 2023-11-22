<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <a-config-provider>
    <RouterView />
  </a-config-provider>
</template>

<style>
#app {
  height: 100vh;
  width: 100vw;
}
</style>
