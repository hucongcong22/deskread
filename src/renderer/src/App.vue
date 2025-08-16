<script setup lang="ts">
import Versions from './components/Versions.vue'
import NovelList from './components/NovelList.vue'

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

const closeWindow = (): void => {
  window.electron.ipcRenderer.send('close-window')
}
</script>

<template>
  <div class="title-bar">
    <button class="close-btn" @click="closeWindow">×</button>
  </div>
  <div class="app-container">
    <NovelList />
  </div>
</template>
