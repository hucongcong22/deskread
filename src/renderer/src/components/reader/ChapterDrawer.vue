<!-- 章节目录抽屉组件 -->
<template>
  <el-drawer
    class="chapter-drawer"
    title="目录"
    :direction="'ltr'"
    size="300px"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="drawer-header">
        <div class="book-info">
          <h2 class="book-title">{{ bookInfo.title }}</h2>
          <p class="book-author">作者: {{ bookInfo.author }}</p>
        </div>
      </div>
    </template>
    <div class="drawer-content">
      <el-input v-model="chapterFilter" placeholder="搜索章节" clearable class="chapter-filter" />
      <div class="chapter-list">
        <div
          v-for="(chapter, index) in filteredChapters"
          :key="index"
          :class="['chapter-item', { active: selectedIndex === index }]"
          @click="$emit('select', index)"
        >
          <span class="chapter-title">{{ chapter.title }}</span>
          <span v-if="selectedIndex === index" class="current-indicator">✓</span>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface BookInfo {
  title: string
  author: string
}

interface Chapter {
  title: string
  url: string
  index: number
}

const props = defineProps<{
  modelValue: boolean
  bookInfo: BookInfo
  chapters: Chapter[]
  selectedIndex: number
}>()

defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', index: number): void
}>()

const chapterFilter = ref('')

const filteredChapters = computed(() => {
  if (!chapterFilter.value) return props.chapters
  const searchText = chapterFilter.value.toLowerCase()
  return props.chapters.filter((chapter) => chapter.title.toLowerCase().includes(searchText))
})
</script>

<style scoped>
.drawer-header {
  padding: 16px 0;
}

.book-info {
  margin-bottom: 16px;
}

.book-title {
  margin: 0 0 8px 0;
  color: var(--ev-c-text-1);
  font-size: 20px;
  font-weight: 600;
}

.book-author {
  margin: 0;
  color: var(--ev-c-text-2);
  font-size: 14px;
  opacity: 0.8;
}

.chapter-drawer :deep(.el-drawer) {
  background-color: var(--color-card-bg);
  border-right: 1px solid var(--color-border);
}

.drawer-content {
  padding: 16px;
}

.chapter-filter {
  margin-bottom: 16px;
}

.chapter-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.chapter-item {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chapter-item:hover {
  background-color: var(--color-fill-2);
}

.chapter-item.active {
  background-color: var(--ev-button-primary-bg);
  color: white;
}

.chapter-title {
  flex: 1;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-indicator {
  color: inherit;
  font-weight: bold;
  margin-left: 8px;
}
</style>
