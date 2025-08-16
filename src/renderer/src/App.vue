<script setup lang="ts">
import Bookshelf from './views/bookshelf/Bookshelf.vue'
const closeWindow = (): void => {
  window.electron.ipcRenderer.send('close-window')
}
</script>

<template>
  <div class="title-bar">
    <button class="close-btn" @click="closeWindow">×</button>
  </div>
  <div class="app-container">
    <Bookshelf />
  </div>
</template>

<style scoped>
.title-bar {
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  -webkit-app-region: drag;
}

.close-btn {
  -webkit-app-region: no-drag;
  background: #ff5f56;
  border: none;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-container {
  padding: 10px;
  height: calc(100vh - 36px);
  overflow-y: auto;
}
</style>
