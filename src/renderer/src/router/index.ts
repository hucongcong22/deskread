import { createRouter, createWebHistory } from 'vue-router'
import Bookshelf from '../views/bookshelf/Bookshelf.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router