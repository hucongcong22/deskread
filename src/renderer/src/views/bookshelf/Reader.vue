<template>
  <div class="reader-container">
    <WindowControls />
    <!-- 书籍信息和章节选择 -->
    <div v-if="currentNovel" class="reader-header">
      <h2>{{ currentNovel.title }}</h2>
      <p>作者: {{ currentNovel.author }}</p>
      <div class="chapter-selector">
        <el-select
          v-model="selectedChapterIndex"
          placeholder="请选择章节"
          filterable
          @change="loadChapterContent"
        >
          <el-option
            v-for="(chapter, index) in chapters"
            :key="index"
            :label="chapter.title"
            :value="index"
          />
        </el-select>
      </div>
    </div>

    <!-- 章节内容展示 -->
    <div v-if="chapterContent" class="chapter-content">
      <div class="content-text" v-html="formatContent(chapterContent)"></div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <p>正在加载章节内容...</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error">
      <p>加载章节内容失败: {{ error }}</p>
    </div>

    <!-- 底部导航按钮 -->
    <div v-if="chapters.length > 0" class="navigation-buttons">
      <el-button
        :disabled="selectedChapterIndex <= 0"
        type="primary"
        size="small"
        @click="loadPreviousChapter"
      >
        上一章
      </el-button>
      <el-button
        :disabled="selectedChapterIndex >= chapters.length - 1"
        type="primary"
        size="small"
        @click="loadNextChapter"
      >
        下一章
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBookChapters, getBookChapterContent } from '@renderer/service/bookshelf/bookshelf'
import { ElButton, ElSelect, ElOption } from 'element-plus'
import WindowControls from '@renderer/components/window/WindowControls.vue'

interface Novel {
  id: number
  title: string
  author: string
  description: string
  status: string
  cover?: string
  lastRead?: Date
  origin?: string
  bookUrl?: string
  durChapterIndex?: number
}

interface BookChapter {
  url: string
  title: string
  isVolume: boolean
  baseUrl: string
  bookUrl: string
  index: number
}

// 响应式数据
const currentNovel = ref<Novel | null>(null)
const chapters = ref<BookChapter[]>([])
const selectedChapterIndex = ref<number>(0)
const chapterContent = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

// 格式化内容
const formatContent = (content: string): string => {
  // 将换行符替换为<br>标签
  return content.replace(/\n/g, '<br>')
}

// 加载章节列表
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const loadChapterList = async (bookUrl: string) => {
  try {
    loading.value = true
    error.value = null
    const chapterList = await getBookChapters(0, bookUrl)
    chapters.value = chapterList

    // 使用小说的当前章节
    const chapterIndex = currentNovel.value?.durChapterIndex || 0
    selectedChapterIndex.value = Math.min(chapterIndex, chapters.value.length - 1)

    // 加载章节内容
    if (chapters.value.length > 0) {
      await loadChapterContent(selectedChapterIndex.value)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取章节列表失败'
  } finally {
    loading.value = false
  }
}

// 加载章节内容
const loadChapterContent = async (index: number): Promise<void> => {
  if (!currentNovel.value?.bookUrl || index < 0 || index >= chapters.value.length) {
    return
  }

  try {
    loading.value = true
    error.value = null
    const chapter = chapters.value[index]
    const content = await getBookChapterContent(chapter.index, currentNovel.value.bookUrl)
    chapterContent.value = content
    selectedChapterIndex.value = index
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取章节内容失败'
  } finally {
    loading.value = false
  }
}

// 加载上一章
const loadPreviousChapter = async (): Promise<void> => {
  if (selectedChapterIndex.value > 0) {
    await loadChapterContent(selectedChapterIndex.value - 1)
  }
}

// 加载下一章
const loadNextChapter = async (): Promise<void> => {
  if (selectedChapterIndex.value < chapters.value.length - 1) {
    await loadChapterContent(selectedChapterIndex.value + 1)
  }
}

// 组件挂载时加载数据
onMounted(() => {
  // 组件加载，不一定能拿到这个值需要等一段时间
  setTimeout(() => {
    const novelData = localStorage.getItem('selectedNovel')
    console.log('novelData', novelData)
    if (!novelData) {
      error.value = '未找到小说信息'
    } else {
      try {
        currentNovel.value = JSON.parse(novelData)
        // 如果有bookUrl，则加载章节列表
        if (currentNovel.value != null && currentNovel.value.bookUrl) {
          loadChapterList(currentNovel.value.bookUrl)
        }
      } catch (_e) {
        console.error('解析小说信息失败:', _e)
        error.value = '解析小说信息失败'
      }
    }
  },50)

})
</script>

<style scoped>
.reader-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 40px;
}

.reader-header {
  text-align: center;
  margin-bottom: 30px;
  flex-shrink: 0;
  padding: 20px;
  background-color: var(--color-card-bg);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}

.reader-header h2 {
  margin: 0 0 12px 0;
  color: var(--ev-c-text-1);
  font-size: 28px;
  font-weight: 700;
}

.reader-header p {
  margin: 8px 0;
  color: var(--ev-c-text-2);
  font-size: 16px;
}

.chapter-selector {
  margin-top: 20px;
}

.chapter-selector :deep(.el-select) {
  width: 100%;
}

.chapter-selector :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chapter-selector :deep(.el-input__inner) {
  font-size: 16px;
  padding: 12px 16px;
}

.chapter-content {
  margin-bottom: 30px;
  padding: 30px;
  background-color: var(--color-card-bg);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex: 1;
  overflow-y: auto;
  border: 1px solid var(--color-border);
}

.content-text {
  line-height: 1.8;
  font-size: 18px;
  color: var(--ev-c-text-1);
  white-space: pre-wrap;
  font-family: 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  letter-spacing: 0.5px;
}

.content-text p {
  margin: 0 0 20px 0;
  text-indent: 2em;
}

.loading,
.error {
  text-align: center;
  padding: 40px 20px;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-shrink: 0;
  padding: 0 20px;
}

.navigation-buttons :deep(.el-button) {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.navigation-buttons :deep(.el-button):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.navigation-buttons :deep(.el-button--primary) {
  background-color: var(--ev-button-primary-bg);
  border-color: var(--ev-button-primary-bg);
}

.navigation-buttons :deep(.el-button--primary:hover) {
  background-color: var(--ev-button-primary-hover-bg);
  border-color: var(--ev-button-primary-hover-bg);
}

@media (max-width: 768px) {
  .reader-container {
    padding: 15px;
    padding-top: 40px;
  }

  .content-text {
    font-size: 16px;
  }

  .navigation-buttons {
    flex-direction: column;
    gap: 10px;
    padding: 0;
  }

  .navigation-buttons :deep(.el-button) {
    width: 100%;
  }
}
</style>
