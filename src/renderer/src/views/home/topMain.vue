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
    <el-button type="" class="close-button" @click="closeWindow">
      <el-icon>
        <CloseBold />
      </el-icon>
    </el-button>
  </div>
</template>
<style scoped lang="scss">
.top-main-container {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
  padding: 0 24px;
  -webkit-app-region: no-drag;
}

.search-input {
  -webkit-app-region: no-drag;
  flex: 1;
  max-width: 400px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-input :deep(.el-input__inner) {
  border-radius: 8px;
}

.import-button {
  -webkit-app-region: no-drag;
  background-color: var(--ev-button-primary-bg);
  color: var(--ev-button-primary-text);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(67, 97, 238, 0.2);
}

.import-button:hover {
  background-color: var(--ev-button-primary-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
}

.close-button {
  -webkit-app-region: no-drag;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--ev-c-danger);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #ef4444;
  transform: scale(1.05);
}
// 响应式设计
@media (max-width: 768px) {
  .top-main-container {
    padding: 0 16px;
  }
  
  .search-input {
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .top-main-container {
    gap: 12px;
    padding: 0 12px;
  }
  
  .search-input {
    max-width: 150px;
  }
  
  .import-button {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  .close-button {
    width: 28px;
    height: 28px;
  }
}
</style>
