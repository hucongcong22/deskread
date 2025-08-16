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
import { ElMenu, ElMenuItem, ElText } from 'element-plus'

const navItems = ref(['书架', '漫画', 'RSS', '播客'])
const activeIndex = ref('书架')

const handleMenuItemClick = (item: string): void => {
  activeIndex.value = item
  // 可以在这里添加路由跳转或其他逻辑
}

const handleSettingsClick = (): void => {
  // 处理设置点击事件
}
</script>

<style scoped lang="less">
.left-main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  -webkit-app-region: no-drag;
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

:deep(.el-menu-item) {
  text-align: center;
  color: #888;
  transition: background 0.2s;
  -webkit-app-region: no-drag;

  &.is-active {
    color: #1976d2;
    font-weight: bold;
    background: #e3f2fd;
  }

  &:hover {
    background-color: #f5f5f5;
  }
}

:deep(.el-menu-item span) {
  position: relative;
  z-index: 1;
}
</style>
