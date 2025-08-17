<template>
  <div class="left-main-container">
    <el-menu
      :default-active="activeIndex"
      class="nav-list"
      :collapse="false"
      :unique-opened="false"
      :router="false"
    >
      <template v-for="item in navItems" :key="item">
        <el-sub-menu v-if="item === '书架'" :index="item">
          <template #title>
            <el-text>{{ item }}</el-text>
          </template>
          <el-menu-item
            v-for="group in bookshelfGroups"
            :key="group.groupId"
            :index="'shelf-' + group.groupId"
            @click="handleGroupClick(group)"
          >
            <el-text>{{ group.groupName }}</el-text>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item" @click="handleMenuItemClick(item)">
          <el-text>{{ item }}</el-text>
        </el-menu-item>
      </template>
    </el-menu>
    <div class="sidebar-bottom">
      <el-menu :unique-opened="false" :router="false">
        <el-menu-item index="settings" @click="handleSettingsClick">
          <el-text>设置</el-text>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMenu, ElMenuItem, ElText, ElMessageBox, ElMessage, ElSubMenu } from 'element-plus'
import type { Action } from 'element-plus'
import { getBookshelfGroups } from '../../service/bookshelf/bookshelf'
import { useRouter } from 'vue-router'

const navItems = ref(['书架', '漫画', 'RSS', '播客'])
const activeIndex = ref('书架')
const router = useRouter()

interface Group {
  groupId: number
  groupName: string
  order: number
  show: boolean
}

const bookshelfGroups = ref<Group[]>([])
// 在组件加载时获取书架分组信息
const loadBookshelfGroups = async (): Promise<void> => {
  const groups = await getBookshelfGroups()
  console.log('获取到的书架分组信息:', groups)
  if (groups) {
    bookshelfGroups.value = groups
      .filter((g: Group) => g.groupId >= -1 && g.show)
      .map((g: Group) => ({
        groupId: g.groupId,
        groupName: g.groupName,
        order: g.order,
        show: g.show
      }))
  }
  console.log('书架分组信息:', bookshelfGroups.value)
}

// 首次加载时获取分组信息
loadBookshelfGroups()

const handleMenuItemClick = (item: string): void => {
  activeIndex.value = item
  if (item === '书架') {
    // 点击书架显示所有书籍
    router.push({
      path: '/bookshelf',
      query: { groupId: -1 }
    })
  } else if (item === '漫画') {
    router.push('/comics')
  } else if (item === 'RSS') {
    router.push('/rss')
  } else if (item === '播客') {
    router.push('/podcast')
  }
}

const handleGroupClick = (group: Group): void => {
  activeIndex.value = 'shelf-' + group.groupId
  // 跳转到对应的书架分组页面，使用实际的 groupId
  router.push({
    path: '/bookshelf',
    query: { groupId: group.groupId }
  })
}

const handleSettingsClick = (): void => {
  // 处理设置点击事件
  ElMessageBox.alert('施工中', '施工中', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK',
    callback: (action: Action) => {
      ElMessage({
        type: 'info',
        message: `action: ${action}`
      })
    }
  })
}
</script>

<style scoped lang="less">
.left-main-container {
  
  display: flex;
  flex-direction: column;
  height: auto;
  -webkit-app-region: no-drag;
  padding: 24px 0;
}

.nav-list {
  flex: 1;
  width: 100%;
  border-right: none;
}

.sidebar-bottom {
  width: 100%;
  margin-top: auto;

  :deep(.el-menu) {
    border-right: none;
  }
}

:deep(.el-menu) {
  border-right: none !important;
  background-color: transparent;
}

:deep(.el-menu-item) {
  text-align: center;
  color: var(--ev-c-text-2);
  transition: all 0.2s ease;
  -webkit-app-region: no-drag;
  border-radius: 8px;
  margin: 4px 12px;
  height: 44px;
  line-height: 44px;

  &.is-active {
    color: var(--ev-button-primary-text);
    font-weight: 600;
    background: var(--ev-button-primary-bg);
    box-shadow: 0 2px 4px rgba(67, 97, 238, 0.2);
  }

  &:hover {
    background-color: var(--ev-button-alt-hover-bg);
    color: var(--ev-c-text-1);
  }
}

:deep(.el-menu-item span) {
  position: relative;
  z-index: 1;
}

:deep(.el-sub-menu) {
  .el-sub-menu__title {
    text-align: center;
    color: var(--ev-c-text-2);
    transition: all 0.2s ease;
    border-radius: 8px;
    margin: 4px 12px;
    height: 44px;
    line-height: 44px;

    &:hover {
      background-color: var(--ev-button-alt-hover-bg);
      color: var(--ev-c-text-1);
    }
  }

  &.is-active {
    > .el-sub-menu__title {
      color: var(--ev-button-primary-text);
      font-weight: 600;
      background: var(--ev-button-primary-bg);
      box-shadow: 0 2px 4px rgba(67, 97, 238, 0.2);
    }
  }

  .el-menu-item {
    padding-left: 48px !important;
    min-width: auto;
    text-align: left;
    margin: 2px 12px;
    &:hover {
      padding-left: 54px !important;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .left-main-container {
    padding: 16px 0;
  }
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      margin: 4px 8px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
    }

    .el-menu-item {
      padding-left: 24px !important;

      &:hover {
        padding-left: 28px !important;
      }
    }
  }
  :deep(.el-menu-item) {
    margin: 4px 8px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .left-main-container {
    padding: 12px 0;
  }
  :deep(.el-menu-item) {
    margin: 4px 6px;
    height: 36px;
    line-height: 36px;
    font-size: 13px;
  }
}
</style>
