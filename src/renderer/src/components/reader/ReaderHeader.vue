<!-- 阅读器顶部导航栏组件 -->
<template>
  <div class="reader-header">
    <div class="header-left">
      <el-button size="small" circle @click="$emit('openChapter')">
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
  (e: 'openChapter'): void
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
  padding: 0;
  margin: 0;
  justify-content: space-between; /* 子元素在主轴上两端对齐 */
  background-color: var(--color-card-bg); /* 背景色，使用CSS变量定义 */
  border-bottom: 1px solid var(--color-border); /* 底部边框，1像素实线，颜色由CSS变量定义 */
  backdrop-filter: blur(8px); /* 背景模糊效果，值为8像素 */
  height: 36px;
}
.reader-header ::v-deep(.window-controls) {
  width: 94vw;
  margin-left: auto;
}

.header-left,
.header-right {
  display: flex;
}

:deep(.el-button) {
  background-color: transparent;
  border: 1px solid var(--color-border);
  width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 50%;
}

:deep(.el-button:hover) {
  background-color: var(--color-fill-2);
}

:deep(.el-icon) {
  font-size: 16px;
  vertical-align: middle;
}
</style>
