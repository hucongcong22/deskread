<script setup lang="ts">
import topMain from './views/home/topMain.vue'
import leftMain from './views/home/leftMain.vue'
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <topMain />
    </el-header>
    <el-container class="app-body">
      <el-aside class="app-sidebar">
        <leftMain />
      </el-aside>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="less">
.app-container {
  height: 97vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.app-header {
  height: 70px;
  padding: 0;
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1000;
  display: flex;
  align-items: center;
  -webkit-app-region: drag;
}

.app-body {
  flex: 1;
  overflow: hidden;
}

.app-sidebar {
  width: 220px;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
  z-index: 999;
  overflow-y: auto;
  transition: all 0.3s ease;
  -webkit-app-region: no-drag;
}

.app-main {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f8f9fa;
  -webkit-app-region: no-drag;
}

// 当屏幕较小时的适配
@media (max-width: 768px) {
  .app-sidebar {
    width: 70px;
  }

  .app-header {
    height: 60px;
  }

  .app-main {
    padding: 16px;
  }
}

// 手机端适配
@media (max-width: 480px) {
  .app-sidebar {
    width: 0;
    overflow: hidden;
  }

  .app-main {
    margin-left: 0;
    padding: 12px;
  }

  .app-header {
    padding: 0 12px;
  }
}
</style>
