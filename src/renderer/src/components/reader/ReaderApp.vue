<template>
  <div id="reader-app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 这是一个简化版的 App 组件，专门用于阅读器窗口
// 它不包含主应用的布局结构，只显示路由内容
</script>

<style scoped>
#reader-app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>