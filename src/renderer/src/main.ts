import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

// Create the Vue application instance
const app = createApp(App)

// Mount the application to the DOM
app.mount('#app')

// For debugging purposes in development
if (import.meta.env.DEV) {
  console.log('Deskread application initialized')
}
