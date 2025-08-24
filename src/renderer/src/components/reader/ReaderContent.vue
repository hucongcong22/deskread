<!-- 阅读器内容显示组件 -->
<template>
  <div class="content-container" :class="{ 'dark-mode': isDarkMode }" @click="$emit('click', $event)">
    <div class="content-text" :style="{ fontSize: fontSize + 'px', lineHeight: lineHeight }">
      <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  paragraphs: string[]
  fontSize: number
  lineHeight: string
  isDarkMode: boolean
}>()

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<style scoped>
.content-container {
  margin-bottom: 20px;
  padding: 32px 40px;
  background-color: var(--color-card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.content-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.content-container.dark-mode {
  background-color: #1a1a1a;
  color: #e0e0e0;
  border-color: #333;
}

.content-text {
  color: var(--ev-c-text-1);
  white-space: pre-wrap;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  letter-spacing: 0.3px;
  transition: font-size 0.2s ease;
  max-width: 680px;
  margin: 0 auto;
}

.content-text p {
  margin: 0 0 24px 0;
  text-indent: 2em;
  line-height: inherit;
}

.content-text p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .content-container {
    padding: 24px 20px;
  }
}
</style>
