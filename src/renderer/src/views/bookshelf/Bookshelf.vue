<template>
  <div class="bookshelf-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <p>正在加载书架数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>加载书架数据失败: {{ error }}</p>
      <button @click="loadBookshelfData">重新加载</button>
    </div>

    <!-- 小说列表 -->
    <div v-if="!loading && !error && bookshelf.length > 0" class="novel-list">
      <div
        v-for="novel in bookshelf"
        :key="novel.id"
        class="novel-item"
        @click="selectNovel(novel)"
      >
        <div v-if="novel.cover" class="novel-cover">
          <img :src="novel.cover" :alt="novel.title" @error="handleImageError($event)" />
        </div>
        <div v-else class="novel-cover placeholder">
          <span>暂无封面</span>
        </div>
        <div class="novel-info">
          <h3>{{ novel.title }}</h3>
          <p class="author">作者: {{ novel.author }}</p>
          <p class="description">{{ novel.description }}</p>
          <p class="status">状态: {{ novel.status }}</p>
          <div class="novel-actions">
            <button @click.stop="editNovel(novel)">编辑</button>
            <button @click.stop="removeNovel(novel.id)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空书架提示 -->
    <div v-else-if="!loading && !error" class="empty-bookshelf">
      <p>书架还是空的，快添加你喜欢的小说吧！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getBookshelf, BookInfoBean } from '@renderer/service/bookshelf/bookshelf'

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
}

// 响应式数据
const bookshelf = ref<Novel[]>([])
const showAddForm = ref(false)
const editingNovel = ref<Novel | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const route = useRoute()

const currentNovel = reactive({
  id: 0,
  title: '',
  author: '',
  description: '',
  status: '连载中',
  cover: ''
})

// 获取当前groupId
const getCurrentGroupId = (): number => {
  const groupId = route.query.groupId
  return groupId === undefined || groupId === null ? -1 : Number(groupId)
}
// 编辑小说
const editNovel = (novel: Novel): void => {
  editingNovel.value = novel
  Object.assign(currentNovel, { ...novel })
  showAddForm.value = true
}

// 删除小说
const removeNovel = (id: number): void => {
  if (confirm('确定要从书架中删除这本小说吗？')) {
    bookshelf.value = bookshelf.value.filter((novel) => novel.id !== id)
    saveToLocalStorage()
  }
}

// 选择小说（查看详情）
const selectNovel = (novel: Novel): void => {
  console.log('Selected novel:', novel)
  // 这里可以添加跳转到小说详情页的逻辑
  alert(`选择了小说: ${novel.title}`)
}

// 处理图片加载错误
const handleImageError = (event: Event): void => {
  const target = event.target as HTMLImageElement
  // 设置一个默认的占位图 URL，防止控制台报错
  // target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  target.src = getRandomDefaultCover()
}

// 保存到本地存储
const saveToLocalStorage = (): void => {
  try {
    localStorage.setItem('novelBookshelf', JSON.stringify(bookshelf.value))
  } catch (e) {
    console.error('保存书架数据失败:', e)
  }
}

// 从本地存储加载
const loadFromLocalStorage = (): void => {
  try {
    const saved = localStorage.getItem('novelBookshelf')
    if (saved) {
      bookshelf.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('加载书架数据失败:', e)
  }
}

// 处理图片路径的问题
const processImagePaths = (imgurl: string): string => {
  if (imgurl.startsWith('http://') || imgurl.startsWith('https://')) {
    return imgurl
  } else {
    imgurl = 'http://192.168.5.12:4396' + imgurl
    return imgurl
  }
}

// 随机默认图片
const getRandomDefaultCover = (): string => {
  const defaultCovers = [
    '/src/assets/default/covers/132917583_p10.png',
    '/src/assets/default/covers/132917583_p14.png',
    '/src/assets/default/covers/132917583_p17.png'
  ]
  const randomIndex = Math.floor(Math.random() * defaultCovers.length)
  return defaultCovers[randomIndex]
}

// 从API加载书架数据
const loadBookshelfData = async (): Promise<void> => {
  loading.value = true
  error.value = null

  try {
    const response = await getBookshelf()
    console.log('API数据:', response)
    if (response) {
      // 获取当前groupId
      const currentGroupId = getCurrentGroupId()

      // 根据groupId过滤数据
      let filteredBooks = response
      if (currentGroupId !== -1) {
        // 如果groupId不为-1，则只显示该分组的书籍
        filteredBooks = response.filter((item: BookInfoBean) => item.group === currentGroupId)
      }
      // 如果groupId为-1或未指定，则显示所有书籍（不过滤）

      // 转换API数据为本地Novel格式
      bookshelf.value = filteredBooks.map((item: BookInfoBean) => {
        // 从bookInfoBean中提取信息，如果没有则使用默认值
        const bookInfo = item || ({} as BookInfoBean)
        let imgurl = bookInfo.coverUrl || ''

        if (imgurl) {
          imgurl = processImagePaths(imgurl)
        } else {
          imgurl = getRandomDefaultCover()
        }

        return {
          id: 22,
          title: bookInfo.name || '未知书名',
          author: bookInfo.author || '未知作者',
          description: bookInfo.intro || '暂无简介',
          status: bookInfo.isInShelf ? '连载中' : '已完结',
          cover: imgurl,
          origin: item.origin,
          bookUrl: item.bookUrl
        }
      })
      // 保存到本地存储作为缓存
      saveToLocalStorage()
    } else {
      error.value = response || '未知错误'
      // 如果API失败，尝试从本地加载
      loadFromLocalStorage()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '网络错误'
    // 如果API失败，尝试从本地加载
    loadFromLocalStorage()
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadBookshelfData()
})

// 监听路由变化
watch(
  () => route.query.groupId,
  () => {
    loadBookshelfData()
  }
)
</script>

<style scoped>
.bookshelf-container {
  width: auto;
  margin: 0 auto;
  padding: 0;
}

.bookshelf-container h2 {
  text-align: left;
  color: var(--ev-c-text-1);
  margin: 0 0 24px 0;
  font-size: 28px;
  font-weight: 700;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.loading,
.error {
  text-align: center;
  padding: 20px;
}

.loading p,
.error p {
  margin: 0 0 15px 0;
}

.error button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.actions-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.add-btn,
.refresh-btn {
  background-color: var(--ev-button-primary-bg);
  color: var(--ev-button-primary-text);
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(67, 97, 238, 0.2);
}

.refresh-btn:disabled {
  background-color: var(--ev-c-gray-2);
  cursor: not-allowed;
  box-shadow: none;
}

.add-btn:hover,
.refresh-btn:hover:not(:disabled) {
  background-color: var(--ev-button-primary-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
}

.add-novel-form {
  background-color: var(--color-card-bg);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.add-novel-form h3 {
  margin-top: 0;
  color: var(--ev-c-text-1);
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--ev-c-text-1);
  font-weight: 500;
  font-size: 14px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--ev-c-text-1);
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--ev-c-primary);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.form-actions button[type='submit'] {
  background-color: var(--ev-button-primary-bg);
  color: var(--ev-button-primary-text);
  box-shadow: 0 2px 4px rgba(67, 97, 238, 0.2);
}

.form-actions button[type='submit']:hover {
  background-color: var(--ev-button-primary-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
}

.form-actions button[type='button'] {
  background-color: var(--ev-button-alt-bg);
  color: var(--ev-button-alt-text);
  border: 1px solid var(--color-border);
}

.form-actions button[type='button']:hover {
  background-color: var(--ev-button-alt-hover-bg);
  transform: translateY(-2px);
}

.novel-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.novel-item {
  display: flex;
  background-color: var(--color-card-bg);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  flex-direction: column;
}

.novel-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.novel-cover {
  width: 100%;
  height: 180px;
  background-color: var(--color-background-mute);
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.novel-cover.placeholder {
  background-color: var(--color-background-mute);
  border: 1px dashed var(--color-border);
}

.novel-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.novel-cover span {
  color: var(--ev-c-text-2);
  font-size: 14px;
  text-align: center;
}

.novel-info {
  flex: 1;
  position: relative;
}

.novel-info h3 {
  margin: 0 0 8px 0;
  color: var(--ev-c-text-1);
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
}

.author {
  margin: 8px 0;
  color: var(--ev-c-text-2);
  font-size: 14px;
}

.description {
  margin: 8px 0;
  color: var(--ev-c-text-2);
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: var(--ev-c-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.novel-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  position: relative;
  top: 0;
  right: 0;
  justify-content: flex-end;
}

.novel-actions button {
  padding: 6px 12px;
  font-size: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.novel-actions button:first-child {
  background-color: var(--ev-c-secondary);
  color: var(--ev-c-black);
}

.novel-actions button:first-child:hover {
  background-color: #38b6e0;
  transform: translateY(-2px);
}

.novel-actions button:last-child {
  background-color: var(--ev-c-danger);
  color: white;
}

.novel-actions button:last-child:hover {
  background-color: #ef4444;
  transform: translateY(-2px);
}

.empty-bookshelf {
  text-align: center;
  padding: 60px 20px;
  color: var(--ev-c-text-2);
  background-color: var(--color-card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  grid-column: 1 / -1;
}

.empty-bookshelf p {
  font-size: 18px;
  margin: 0 0 24px 0;
}

.empty-bookshelf .add-btn {
  background-color: var(--ev-button-primary-bg);
  color: var(--ev-button-primary-text);
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(67, 97, 238, 0.2);
  margin: 0 auto;
}

.empty-bookshelf .add-btn:hover {
  background-color: var(--ev-button-primary-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
}

@media (max-width: 768px) {
  .novel-list {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .novel-cover {
    height: 160px;
  }
}

@media (max-width: 600px) {
  .novel-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .novel-cover {
    height: 200px;
  }
  
  .actions-bar {
    flex-direction: column;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>
