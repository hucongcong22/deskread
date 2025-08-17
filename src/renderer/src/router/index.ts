import { createRouter, createWebHistory } from 'vue-router'
import Bookshelf from '../views/bookshelf/Bookshelf.vue'
import BookContent from '../views/bookshelf/BookContent.vue'

const routes = [
  {
    path: '/',
    redirect: '/bookshelf?groupId=-1'
  },
  {
    path: '/bookshelf',
    name: 'Bookshelf',
    component: Bookshelf,
    props: (route) => ({ groupId: route.query.groupId || -1 })
  },
  {
    path: '/book-content/:novel',
    name: 'BookContent',
    component: BookContent,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
