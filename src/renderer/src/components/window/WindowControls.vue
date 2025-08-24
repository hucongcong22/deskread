<template>
  <div class="window-controls">
    <div class="window-drag-bar"></div>
    <div class="window-buttons">
      <button class="window-button minimize" @click="minimizeWindow">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M0 5h12v2H0z" fill="currentColor" />
        </svg>
      </button>
      <button class="window-button maximize" @click="maximizeWindow">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M0 0h12v12H0V0zm1 1v10h10V1H1z" fill="currentColor" />
        </svg>
      </button>
      <button class="window-button close" @click="closeWindow">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M0 0L12 12M12 0L0 12" stroke="currentColor" stroke-width="1" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const minimizeWindow = (): void => {
  if (window.api && typeof window.api.minimizeWindow === 'function') {
    window.api.minimizeWindow()
  }
}

const maximizeWindow = (): void => {
  if (window.api && typeof window.api.maximizeWindow === 'function') {
    window.api.maximizeWindow()
  }
}

const closeWindow = (): void => {
  if (window.api && typeof window.api.closeWindow === 'function') {
    window.api.closeWindow()
  }
}
</script>

<style scoped>
.window-controls {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  z-index: 10000;
  -webkit-app-region: drag;
}

.window-drag-bar {
  flex: 1;
  height: 100%;
  -webkit-app-region: drag;
}

.window-buttons {
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
}

.window-button {
  width: 32px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--ev-c-text-2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.window-button:hover {
  background: var(--ev-c-gray-3);
  color: var(--ev-c-text-1);
}

.window-button.close:hover {
  background: #ff5f57;
  color: white;
}

.window-button.maximize:hover {
  background: #28c940;
  color: white;
}

.window-button.minimize:hover {
  background: #ffbd2e;
  color: white;
}
</style>
