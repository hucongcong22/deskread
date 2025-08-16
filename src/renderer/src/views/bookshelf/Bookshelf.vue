<template>
  <div class="bookshelf-container">
    <h2>我的书架</h2>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <p>正在加载书架数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>加载书架数据失败: {{ error }}</p>
      <button @click="loadBookshelfData">重新加载</button>
    </div>

    <!-- 添加小说表单 -->
    <div v-else-if="showAddForm" class="add-novel-form">
      <h3>{{ editingNovel ? '编辑小说' : '添加小说' }}</h3>
      <form @submit.prevent="saveNovel">
        <div class="form-group">
          <label for="title">书名:</label>
          <input
            id="title"
            v-model="currentNovel.title"
            type="text"
            required
            placeholder="请输入小说名称"
          />
        </div>

        <div class="form-group">
          <label for="author">作者:</label>
          <input
            id="author"
            v-model="currentNovel.author"
            type="text"
            required
            placeholder="请输入作者姓名"
          />
        </div>

        <div class="form-group">
          <label for="description">简介:</label>
          <textarea
            id="description"
            v-model="currentNovel.description"
            placeholder="请输入小说简介"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="status">状态:</label>
          <select id="status" v-model="currentNovel.status">
            <option value="连载中">连载中</option>
            <option value="已完结">已完结</option>
            <option value="暂停更新">暂停更新</option>
          </select>
        </div>

        <div class="form-group">
          <label for="cover">封面链接:</label>
          <input
            id="cover"
            v-model="currentNovel.cover"
            type="text"
            placeholder="请输入封面图片链接"
          />
        </div>

        <div class="form-actions">
          <button type="submit">{{ editingNovel ? '更新' : '添加' }}</button>
          <button type="button" @click="cancelEdit">取消</button>
        </div>
      </form>
    </div>

    <!-- 添加小说按钮 -->
    <div v-else-if="!showAddForm" class="actions-bar">
      <button class="add-btn" @click="showAddNovelForm">+ 添加小说</button>
      <button class="refresh-btn" :disabled="loading" @click="loadBookshelfData">刷新书架</button>
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
import { ref, reactive, onMounted } from 'vue'
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

const currentNovel = reactive({
  id: 0,
  title: '',
  author: '',
  description: '',
  status: '连载中',
  cover: ''
})

// 显示添加小说表单
const showAddNovelForm = (): void => {
  resetForm()
  showAddForm.value = true
}

// 重置表单
const resetForm = (): void => {
  editingNovel.value = null
  currentNovel.id = Date.now()
  currentNovel.title = ''
  currentNovel.author = ''
  currentNovel.description = ''
  currentNovel.status = '连载中'
  currentNovel.cover = ''
}

// 保存小说（添加或更新）
const saveNovel = (): void => {
  if (editingNovel.value) {
    // 更新现有小说
    const index = bookshelf.value.findIndex((novel) => novel.id === editingNovel.value!.id)
    if (index !== -1) {
      bookshelf.value[index] = { ...currentNovel }
    }
  } else {
    // 添加新小说
    bookshelf.value.push({ ...currentNovel })
  }

  // 保存到本地存储
  saveToLocalStorage()

  // 重置表单并隐藏
  resetForm()
  showAddForm.value = false
}

// 取消编辑
const cancelEdit = (): void => {
  resetForm()
  showAddForm.value = false
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
  target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
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

// 从API加载书架数据
const loadBookshelfData = async (): Promise<void> => {
  loading.value = true
  error.value = null

  try {
    const response = await getBookshelf()
    console.log('API数据:', response)
    if (response) {
      // 转换API数据为本地Novel格式
      bookshelf.value = response.map((item: BookInfoBean) => {
        // 从bookInfoBean中提取信息，如果没有则使用默认值
        const bookInfo = item || ({} as BookInfoBean)

        return {
          id: 22,
          title: bookInfo.name || '未知书名',
          author: bookInfo.author || '未知作者',
          description: bookInfo.intro || '暂无简介',
          status: bookInfo.isInShelf ? '连载中' : '已完结',
          cover: bookInfo.coverUrl || '',
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
</script>

<style scoped>
.bookshelf-container {
  width: 100%;
  margin: 20px auto;
  padding: 20px;
}

.bookshelf-container h2 {
  text-align: center;
  color: var(--ev-c-text-1);
  margin-bottom: 20px;
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

.add-btn,
.refresh-btn {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;
  margin-right: 10px;
}

.refresh-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.add-btn:hover,
.refresh-btn:hover:not(:disabled) {
  background-color: #359c6d;
}

.add-novel-form {
  background-color: var(--color-background-mute);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.add-novel-form h3 {
  margin-top: 0;
  color: var(--ev-c-text-1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: var(--ev-c-text-1);
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--ev-c-text-1);
  font-size: 14px;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.form-actions button[type='submit'] {
  background-color: #42b883;
  color: white;
}

.form-actions button[type='submit']:hover {
  background-color: #359c6d;
}

.form-actions button[type='button'] {
  background-color: #6c757d;
  color: white;
}

.form-actions button[type='button']:hover {
  background-color: #5a6268;
}

.novel-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.novel-item {
  display: flex;
  background-color: var(--color-background-mute);
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.novel-item:hover {
  background-color: var(--ev-button-alt-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.novel-cover {
  width: 80px;
  height: 100px;
  background-color: #ddd;
  border-radius: 4px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.novel-cover.placeholder {
  background-color: #eee;
}

.novel-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.novel-cover span {
  color: #999;
  font-size: 12px;
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
}

.author {
  margin: 5px 0;
  color: var(--ev-c-text-2);
  font-size: 14px;
}

.description {
  margin: 5px 0;
  color: var(--ev-c-text-2);
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status {
  margin: 5px 0 0 0;
  font-size: 12px;
  color: #42b883;
  font-weight: 600;
}

.novel-actions {
  position: absolute;
  top: 0;
  right: 0;
}

.novel-actions button {
  margin-left: 5px;
  padding: 4px 8px;
  font-size: 12px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.novel-actions button:first-child {
  background-color: #007bff;
  color: white;
}

.novel-actions button:last-child {
  background-color: #dc3545;
  color: white;
}

.empty-bookshelf {
  text-align: center;
  padding: 40px 20px;
  color: var(--ev-c-text-2);
}

.empty-bookshelf p {
  font-size: 18px;
  margin: 0;
}

@media (max-width: 600px) {
  .novel-item {
    flex-direction: column;
  }

  .novel-cover {
    width: 100%;
    height: 150px;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .novel-actions {
    position: relative;
    margin-top: 10px;
  }
}
</style>
