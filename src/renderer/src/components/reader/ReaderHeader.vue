<!-- 阅读器顶部导航栏组件 -->
<template>
  <div class="reader-header" :class="{ 'dark-mode': isDarkMode }">
    <div class="header-left">
      <el-button size="small" circle @click="$emit('open-chapter')">
        <el-icon><Document /></el-icon>
      </el-button>
    </div>

    <div>
      <!-- 这里是窗口操作按钮的预留位置 -->
      <WindowControls />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
import WindowControls from '@renderer/components/window/WindowControls.vue'

defineProps<{
  isDarkMode: boolean
  isFullscreen: boolean
}>()

defineEmits<{
  (e: 'open-chapter'): void
}>()
</script>

<style scoped>
.reader-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  padding: 0 12px;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
  background-color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px) saturate(1.5);
  -webkit-backdrop-filter: blur(12px) saturate(1.5);
}

.reader-header ::v-deep(.window-controls) {
  width: 94vw;
  margin-left: auto;
}

.reader-header.dark-mode {
  background-color: rgba(30, 30, 30, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

:deep(.el-button) {
  background-color: transparent;
  border: none;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 8px;
}

:deep(.el-button:hover) {
  background-color: var(--color-fill-2);
}

:deep(.el-icon) {
  font-size: 20px;
}
</style>
