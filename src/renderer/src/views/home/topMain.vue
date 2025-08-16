<script setup lang="ts">
import { ref } from 'vue'
import { CloseBold } from '@element-plus/icons-vue'

const input = ref('')

const closeWindow = (): void => {
  window.electron.ipcRenderer.send('close-window')
}
</script>
<template>
  <div class="top-main-container">
    <el-input v-model="input" style="width: 240px" placeholder="查询书籍" class="search-input" />
    <el-button type="primary" class="import-button"> 导入书籍 </el-button>
    <el-button type="danger" class="close-button" @click="closeWindow">
      <el-icon>
        <CloseBold />
      </el-icon>
    </el-button>
  </div>
</template>
<style scoped>
.top-main-container {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  -webkit-app-region: no-drag;
}

.search-input {
  -webkit-app-region: no-drag;
}

.import-button {
  -webkit-app-region: no-drag;
}

.close-button {
  -webkit-app-region: no-drag;
}
</style>
