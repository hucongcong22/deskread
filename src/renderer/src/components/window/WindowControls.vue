<template>
  <div class="window-controls">
    <div class="window-drag-bar"></div>
    <div class="window-buttons">
      <button class="window-button minimize" @click="minimizeWindow">
        <svg width="12" height="12" viewBox="0 0 16 16">
          <path d="M14 8.5H2a.5.5 0 0 1 0-1h12a.5.5 0 0 1 0 1z" fill="currentColor" />
        </svg>
      </button>
      <button class="window-button maximize" @click="maximizeWindow">
        <svg width="12" height="12" viewBox="0 0 16 16">
          <path d="M3 3v10h10V3H3zm9 9H4V4h8v8z" fill="currentColor" />
        </svg>
      </button>
      <button class="window-button close" @click="closeWindow">
        <svg width="12" height="12" viewBox="0 0 16 16">
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" fill="currentColor" />
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
  border-color: #ff5f57;
}

.window-button.maximize:hover {
  background: #28c940;
  color: white;
  border-color: #28c940;
}

.window-button.minimize:hover {
  background: #ffbd2e;
  color: white;
  border-color: #ffbd2e;
}
</style>
