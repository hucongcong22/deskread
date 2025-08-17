import { createRouter, createWebHistory } from 'vue-router'
import Reader from '../views/bookshelf/Reader.vue'

const routes = [
  {
    path: '/',
    redirect: '/reader'
  },
  {
    path: '/reader',
    name: 'Reader',
    component: Reader
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
