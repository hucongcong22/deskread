<template>
  <div class="left-main-container">
    <el-menu
      :default-active="activeIndex"
      class="nav-list"
      :collapse="false"
      :unique-opened="false"
      :router="false"
    >
      <el-menu-item
        v-for="item in navItems"
        :key="item"
        :index="item"
        @click="handleMenuItemClick(item)"
      >
        <el-text>{{ item }}</el-text>
      </el-menu-item>
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
import { ElMenu, ElMenuItem, ElText, ElMessageBox, ElMessage } from 'element-plus'
import type { Action } from 'element-plus'

const navItems = ref(['书架', '漫画', 'RSS', '播客'])
const activeIndex = ref('书架')

const handleMenuItemClick = (item: string): void => {
  activeIndex.value = item
  // 可以在这里添加路由跳转或其他逻辑
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
        message: `action: ${action}`,
      })
    },
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
// 响应式设计
@media (max-width: 768px) {
  .left-main-container {
    padding: 16px 0;
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
