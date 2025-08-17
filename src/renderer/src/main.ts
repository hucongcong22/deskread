import { createApp } from 'vue'
import App from './App.vue'
import ReaderApp from './components/reader/ReaderApp.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import readerRouter from './router/readerRouter'

// 检查当前路由是否为阅读器路由
const isReaderMode = window.location.hash.includes('#/reader')

// 创建应用实例
const app = createApp(isReaderMode ? ReaderApp : App)

// Use Element Plus
app.use(ElementPlus)
app.use(isReaderMode ? readerRouter : router)

// Mount the application to the DOM
app.mount('#app')

// For debugging purposes in development
if (import.meta.env.DEV) {
  console.log('Deskread application initialized in', isReaderMode ? 'reader' : 'main', 'mode')
}
