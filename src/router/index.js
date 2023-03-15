import { createRouter, createWebHistory } from 'vue-router'
import InputPage from '@/views/InputPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/InputPage',
      name: 'InputPage',
      component: InputPage
    }
  ]
})

export default router
