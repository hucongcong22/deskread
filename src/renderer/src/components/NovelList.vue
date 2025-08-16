<template>
  <div class="novel-list-container">
    <h2>小说列表</h2>
    <div class="novel-list">
      <div 
        v-for="novel in novels" 
        :key="novel.id" 
        class="novel-item"
        @click="selectNovel(novel)"
      >
        <div class="novel-cover" v-if="novel.cover">
          <img :src="novel.cover" :alt="novel.title">
        </div>
        <div class="novel-info">
          <h3>{{ novel.title }}</h3>
          <p class="author">作者: {{ novel.author }}</p>
          <p class="description">{{ novel.description }}</p>
          <p class="status">状态: {{ novel.status }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Novel {
  id: number
  title: string
  author: string
  description: string
  status: string
  cover?: string
}

const novels = ref<Novel[]>([
  {
    id: 1,
    title: '斗破苍穹',
    author: '天蚕土豆',
    description: '这里是属于斗气的世界，没有花俏艳丽的魔法，有的仅仅是繁衍到巅峰的斗气！',
    status: '连载中',
    cover: ''
  },
  {
    id: 2,
    title: '斗罗大陆',
    author: '唐家三少',
    description: '唐门外门弟子唐三，因偷学内门绝学为唐门所不容，跳崖明志时却发现没有死，反而以另外一个身份来到了另一个世界...',
    status: '已完结',
    cover: ''
  },
  {
    id: 3,
    title: '完美世界',
    author: '辰东',
    description: '一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。群雄并起，万族林立，诸圣争霸，乱天动地。',
    status: '已完结',
    cover: ''
  }
])

const selectNovel = (novel: Novel) => {
  console.log('Selected novel:', novel)
  // 这里可以添加跳转到小说详情页的逻辑
}
</script>

<style scoped>
.novel-list-container {
  width: 100%;
  margin: 20px auto;
  padding: 20px;
}

.novel-list-container h2 {
  text-align: center;
  color: var(--ev-c-text-1);
  margin-bottom: 20px;
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
}

.novel-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.novel-info {
  flex: 1;
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
}
</style>