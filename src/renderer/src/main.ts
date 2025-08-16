import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus' //引入
import 'element-plus/dist/index.css'


// Create the Vue application instance
const app = createApp(App)

// Mount the application to the DOM
app.mount('#app')
app.use(ElementPlus)

// For debugging purposes in development
if (import.meta.env.DEV) {
  console.log('Deskread application initialized')
}
