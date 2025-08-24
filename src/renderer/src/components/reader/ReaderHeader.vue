<!-- 阅读器顶部导航栏组件 -->
<template>
  <div class="reader-header">
    <div class="header-left">
      <el-button size="small" circle @click="$emit('openChapter')">
        <el-icon><Document /></el-icon>
      </el-button>
    </div>

    <div class="window-controls">
      <!-- 这里是窗口操作按钮的预留位置 -->
      <WindowControls />
    </div>

    <div class="header-right">
      <el-dropdown trigger="click">
        <el-button size="small" circle>
          <el-icon><Setting /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$emit('toggleDarkMode')">{{ isDarkMode ? '☀️ 日间模式' : '🌙 夜间模式' }}</el-dropdown-item>
            <el-dropdown-item @click="$emit('changeFontSize', -1)">🔍 减小字体</el-dropdown-item>
            <el-dropdown-item @click="$emit('changeFontSize', 1)">🔍 增大字体</el-dropdown-item>
            <el-dropdown-item @click="$emit('toggleFullscreen')">🖥️ {{ isFullscreen ? '退出全屏' : '全屏阅读' }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Document, Setting } from '@element-plus/icons-vue'
import WindowControls from '@renderer/components/window/WindowControls.vue'

defineProps<{
  isDarkMode: boolean
  isFullscreen: boolean
}>()

defineEmits<{
  (e: 'openChapter'): void
  (e: 'toggleDarkMode'): void
  (e: 'changeFontSize', delta: number): void
  (e: 'toggleFullscreen'): void
}>()
</script>

<style scoped>
.reader-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-card-bg);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.window-controls {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-button) {
  background-color: transparent;
  border: 1px solid var(--color-border);
  width: 32px;
  height: 32px;
  padding: 6px;
}

:deep(.el-button:hover) {
  background-color: var(--color-fill-2);
}

:deep(.el-icon) {
  font-size: 16px;
}
</style>
