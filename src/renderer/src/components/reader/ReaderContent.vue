<!-- 阅读器内容显示组件 -->
<template>
  <div
    class="content-container"
    :class="{ 'dark-mode': isDarkMode }"
    @click="$emit('click', $event)"
  >
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
  padding: 20px 0;
  flex: 1;
  overflow-y: auto;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.content-container.dark-mode {
  background-color: var(--color-bg);
  color: var(--color-text);
}

.content-text {
  color: var(--color-text);
  white-space: pre-wrap;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  letter-spacing: 0.3px;
  transition: font-size 0.2s ease;
  max-width: 800px; /* 限制最大宽度以提高可读性 */
  margin: 0 auto;
  padding: 0 20px;
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
  .content-text {
    padding: 0 15px;
  }
}
</style>
