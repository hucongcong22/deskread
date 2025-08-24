<template>
  <div class="reader-container">
    <ReaderHeader
      v-if="currentNovel"
      :is-dark-mode="isDarkMode"
      :is-fullscreen="isFullscreen"
      @open-chapter="showChapterDrawer = true"
      @toggle-dark-mode="toggleDarkMode"
      @change-font-size="changeFontSize"
      @toggle-fullscreen="toggleFullscreen"
    />

    <ChapterDrawer
      v-model:model-value="showChapterDrawer"
      :book-info="currentNovel || { title: '', author: '' }"
      :chapters="chapters"
      :selected-index="selectedChapterIndex"
      @select="selectChapter"
    />

    <ReaderContent
      v-if="chapterContent"
      :paragraphs="formattedParagraphs"
      :font-size="fontSize"
      :line-height="lineHeight"
      :is-dark-mode="isDarkMode"
      @click="handleContentClick"
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p>正在加载章节内容...</p>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="error">
      <el-icon class="error-icon"><Warning /></el-icon>
      <p>加载章节内容失败: {{ error }}</p>
      <el-button size="small" @click="retryLoading">重试</el-button>
    </div>

    <!-- 底部导航栏 -->
    <div v-if="chapters.length > 0" class="bottom-navigation">
      <div class="navigation-buttons left">
        <el-button
          :disabled="selectedChapterIndex <= 0"
          size="small"
          circle
          @click="loadPreviousChapter"
        >
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
      </div>
      <div class="navigation-info">
        <span class="chapter-name">{{ chapters[selectedChapterIndex]?.title }}</span>
        <span class="chapter-progress">
          第 {{ selectedChapterIndex + 1 }} 章 / 共 {{ chapters.length }} 章
        </span>
      </div>
      <div class="navigation-buttons right">
        <el-button
          :disabled="selectedChapterIndex >= chapters.length - 1"
          size="small"
          circle
          @click="loadNextChapter"
        >
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 浮动操作按钮 -->
    <div class="floating-actions" :class="{ visible: showFloatingActions }">
      <el-button circle size="large" class="floating-btn" @click="toggleDarkMode">
        <el-icon>
          <Sunny v-if="isDarkMode" />
          <Moon v-else />
        </el-icon>
      </el-button>
      <el-button circle size="large" class="floating-btn" @click="toggleFullscreen">
        <el-icon>
          <FullScreen v-if="isFullscreen" />
          <Crop v-else />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { getBookChapters, getBookChapterContent } from '@renderer/service/bookshelf/bookshelf'
import { ElButton, ElIcon } from 'element-plus'
import { ArrowLeft, ArrowRight, Loading, Warning } from '@element-plus/icons-vue'
import ReaderHeader from '@renderer/components/reader/ReaderHeader.vue'
import ChapterDrawer from '@renderer/components/reader/ChapterDrawer.vue'
import ReaderContent from '@renderer/components/reader/ReaderContent.vue'

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
const isDarkMode = ref<boolean>(false)
const isFullscreen = ref<boolean>(false)
const fontSize = ref<number>(18)
const lineHeight = ref<string>('1.8')
const showFloatingActions = ref<boolean>(false)
const showChapterDrawer = ref<boolean>(false)
// 选择章节
const selectChapter = (index: number): void => {
  showChapterDrawer.value = false
  loadChapterContent(index)
}

// 格式化内容的计算属性
const formattedParagraphs = computed(() => {
  if (!chapterContent.value) return []
  return chapterContent.value
    .split(/\n\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
})

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

// 切换暗黑模式
const toggleDarkMode = (): void => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark', isDarkMode.value)
}

// 切换全屏
const toggleFullscreen = async (): Promise<void> => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

// 调整字体大小
const changeFontSize = (delta: number): void => {
  fontSize.value = Math.max(12, Math.min(30, fontSize.value + delta))
}

// 内容区域点击处理
const handleContentClick = (event: MouseEvent): void => {
  const contentElement = event.currentTarget as HTMLElement
  const clickX = event.clientX
  const contentWidth = contentElement.offsetWidth

  if (clickX < contentWidth * 0.3) {
    // 点击左侧，上一章
    loadPreviousChapter()
  } else if (clickX > contentWidth * 0.7) {
    // 点击右侧，下一章
    loadNextChapter()
  } else {
    // 点击中间，显示/隐藏浮动按钮
    showFloatingActions.value = !showFloatingActions.value
  }
}

// 重试加载
const retryLoading = (): void => {
  error.value = null
  if (currentNovel.value?.bookUrl) {
    loadChapterList(currentNovel.value.bookUrl)
  }
}

// 监听键盘事件
const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === 'ArrowLeft') {
    loadPreviousChapter()
  } else if (event.key === 'ArrowRight') {
    loadNextChapter()
  } else if (event.key === 'd' || event.key === 'D') {
    toggleDarkMode()
  } else if (event.key === 'f' || event.key === 'F') {
    toggleFullscreen()
  }
}

// 组件挂载时加载数据
// 定义全屏变化处理函数
const handleFullscreenChange = (): void => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyPress)

  // 监听全屏变化
  document.addEventListener('fullscreenchange', handleFullscreenChange)

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
  }, 50)
})

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.reader-container {
  max-width: 800px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 56px; /* 为固定的顶部导航栏留出空间 */
  padding-bottom: 20px;
}

.reader-header {
  margin-bottom: 20px;
  flex-shrink: 0;
  padding: 16px 24px;
  background-color: var(--color-card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.book-info {
  flex: 1;
}

.book-title {
  margin: 0 0 8px 0;
  color: var(--ev-c-text-1);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
}

.book-author {
  margin: 0;
  color: var(--ev-c-text-2);
  font-size: 14px;
  opacity: 0.8;
}

.header-actions {
  margin-left: 16px;
}

.chapter-selector-wrapper {
  margin-top: 16px;
}

.navigation-buttons.top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.chapter-selector {
  flex: 1;
  min-width: 200px;
}

.chapter-selector :deep(.el-select) {
  width: 100%;
}

.chapter-selector :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

.chapter-selector :deep(.el-input__inner) {
  font-size: 14px;
  padding: 10px 14px;
}

.reading-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--ev-c-text-3);
}

.progress-bar {
  flex: 1;
  max-width: 200px;
}

.chapter-content {
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

.chapter-content:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.chapter-content.dark-mode {
  background-color: #1a1a1a;
  color: #e0e0e0;
  border-color: #333;
}

.content-text {
  line-height: v-bind(lineHeight);
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

.loading,
.error {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.loading-icon {
  font-size: 32px;
  color: var(--ev-c-text-3);
  margin-bottom: 16px;
  animation: spin 1s linear infinite;
}

.error-icon {
  font-size: 32px;
  color: var(--ev-c-danger);
  margin-bottom: 16px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.bottom-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  flex-shrink: 0;
  padding: 16px 24px;
  background-color: var(--color-card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--color-border);
}

.navigation-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  max-width: 400px;
  text-align: center;
}

.chapter-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--ev-c-text-1);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.chapter-progress {
  font-size: 12px;
  color: var(--ev-c-text-3);
}

.navigation-buttons {
  display: flex;
  align-items: center;
}

.navigation-buttons.left {
  justify-content: flex-start;
  min-width: 60px;
}

.navigation-buttons.right {
  justify-content: flex-end;
  min-width: 60px;
}

.navigation-buttons :deep(.el-button) {
  padding: 8px;
  font-size: 16px;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
}

.navigation-buttons :deep(.el-button):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.navigation-buttons :deep(.el-button--primary) {
  background-color: var(--ev-button-primary-bg);
  border-color: var(--ev-button-primary-bg);
}

.navigation-buttons :deep(.el-button--primary:hover) {
  background-color: var(--ev-button-primary-hover-bg);
  border-color: var(--ev-button-primary-hover-bg);
}

.floating-actions {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.floating-actions.visible {
  opacity: 1;
  transform: translateY(0);
}

.floating-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .reader-container {
    padding: 12px;
    padding-top: 20px;
  }

  .reader-header {
    padding: 12px 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 12px;
  }

  .book-title {
    font-size: 20px;
  }

  .chapter-content {
    padding: 24px 20px;
  }

  .content-text {
    font-size: 16px !important;
  }

  .navigation-buttons.top {
    flex-direction: column;
    gap: 8px;
  }

  .chapter-selector {
    min-width: unset;
  }

  .bottom-navigation {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }

  .navigation-buttons {
    width: 100%;
    justify-content: space-between;
  }

  .floating-actions {
    right: 16px;
    bottom: 16px;
  }

  .floating-btn {
    width: 44px;
    height: 44px;
  }
}
</style>
