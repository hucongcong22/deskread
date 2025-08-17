import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' //引入
import 'element-plus/dist/index.css'
import router from './router'

// Create the Vue application instance
const app = createApp(App)

// Use Element Plus
app.use(ElementPlus)
app.use(router)

// Mount the application to the DOM
app.mount('#app')

// For debugging purposes in development
if (import.meta.env.DEV) {
  console.log('Deskread application initialized')
}
