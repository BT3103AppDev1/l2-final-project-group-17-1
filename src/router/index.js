import { createRouter, createWebHistory } from 'vue-router'
import InputPage from '@/views/InputPage.vue'
import Trips from '@/views/Trips.vue'
import LogIn from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
import Register from '@/views/Register.vue'

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
      path: '/',
      name: 'LogIn',
      component: LogIn
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ]
})

export default router
