import { createRouter, createWebHistory } from 'vue-router'
import InputPage from '@/views/InputPage.vue'
import Trips from '@/views/Trips.vue'
import LogIn from '@/views/Login.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/InputPage',
      name: 'InputPage',
      component: InputPage
    },
    {
      path: '/trips',
      name: 'Trips',
      component: Trips
    },
    {
      path: '/login',
      name: 'LogIn',
      component: LogIn
    }
  ]
})

export default router
