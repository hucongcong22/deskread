<script setup lang="ts">
import Bookshelf from './views/bookshelf/Bookshelf.vue'
import topMain from './views/home/topMain.vue'
import leftMain from './views/home/leftMain.vue'
</script>

<template>

    <el-container>
      <el-header class="fixed-header"><topMain /></el-header>
      <el-container>
        <el-aside class="fixed-aside"><leftMain /></el-aside>
        <el-main class="main-content"><Bookshelf /></el-main>
      </el-container>
    </el-container>

</template>

<style scoped lang="less">
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  box-sizing: border-box;
  -webkit-app-region: no-drag;
}

.fixed-aside {
  position: fixed;
  left: 0;
  top: 80px;
  bottom: 0;
  width: 15%;
  z-index: 999;
  background-color: #fff;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  padding: 20px 0;
  box-sizing: border-box;
  -webkit-app-region: no-drag;
}

.main-content {
  position: fixed;
  margin-top: 60px;
  margin-left: 15%;
  height: calc(100vh - 60px);
  overflow-y: auto;
  padding: 0px;
  box-sizing: border-box;
  -webkit-app-region: no-drag;
}

// 当屏幕较小时的适配
@media (max-width: 768px) {
  .fixed-aside {
    width: 60px;
  }
  .main-content {
    margin-left: 60px;
  }
}
</style>
