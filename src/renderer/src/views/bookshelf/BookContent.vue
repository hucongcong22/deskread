<template>
  <div class="book-content-container">
    <!-- 返回按钮 -->
    <div class="back-button-container">
      <el-button type="primary" size="small" round @click="goBack">返回书架</el-button>
    </div>

    <!-- 书籍信息和章节选择 -->
    <div v-if="currentNovel" class="book-header">
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
import { useRoute, useRouter } from 'vue-router'
import { getBookChapters, getBookChapterContent } from '@renderer/service/bookshelf/bookshelf'
import { ElButton, ElSelect, ElOption } from 'element-plus'

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
const route = useRoute()
const router = useRouter()
const currentNovel = ref<Novel | null>(null)
const chapters = ref<BookChapter[]>([])
const selectedChapterIndex = ref<number>(0)
const chapterContent = ref<string>('')
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

// 返回书架
const goBack = (): void => {
  router.go(-1)
}

// 格式化内容
const formatContent = (content: string): string => {
  // 将换行符替换为<br>标签
  return content.replace(/\n/g, '<br>')
}

// 加载章节列表
const loadChapterList = async (bookUrl: string): Promise<void> => {
  try {
    loading.value = true
    error.value = null
    const chapterList = await getBookChapters(0, bookUrl)
    chapters.value = chapterList

    // 如果有指定章节索引，则使用指定的，否则使用小说的当前章节
    const chapterIndex =
      Number(route.query.chapterIndex) || currentNovel.value?.durChapterIndex || 0
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

    // 更新URL中的章节索引
    await router.replace({
      ...route,
      query: {
        ...route.query,
        chapterIndex: index.toString()
      }
    })
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
  // 从路由参数获取小说信息
  const novelData = route.params.novel ? JSON.parse(route.params.novel as string) : null
  if (novelData) {
    currentNovel.value = novelData

    // 如果有bookUrl，则加载章节列表
    if (novelData.bookUrl) {
      loadChapterList(novelData.bookUrl)
    }
  } else {
    error.value = '未找到小说信息'
  }
})
</script>

<style scoped>
.book-content-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.back-button-container {
  margin-bottom: 20px;
}

.book-header {
  text-align: center;
  margin-bottom: 30px;
}

.book-header h2 {
  margin: 0 0 10px 0;
  color: var(--ev-c-text-1);
}

.book-header p {
  margin: 5px 0;
  color: var(--ev-c-text-2);
}

.chapter-selector {
  margin-top: 20px;
}

.chapter-content {
  margin-bottom: 30px;
  padding: 20px;
  background-color: var(--color-card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-text {
  line-height: 1.8;
  font-size: 16px;
  color: var(--ev-c-text-1);
  white-space: pre-wrap;
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
}

@media (max-width: 768px) {
  .book-content-container {
    padding: 15px;
  }

  .content-text {
    font-size: 14px;
  }

  .navigation-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .navigation-buttons .el-button {
    width: 100%;
  }
}
</style>
