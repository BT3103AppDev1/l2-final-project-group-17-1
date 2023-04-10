import { createRouter, createWebHistory } from 'vue-router'
import InputPage from '@/views/InputPage.vue'
import Trips from '@/views/Trips.vue'
import LogIn from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'
//import PersonalPage from '@/components/PersonalPage.vue'
//import GroupPage from '@/views/GroupPage.vue'
import Profile from '@/views/Profile.vue'
import Dashboard from '@/views/Dashboard.vue'
import Navbar from '@/components/Navbar.vue'

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
    // {
    //   //path: '/PersonalPage?tripCode:tripCode&budget:budget&tripName:tripName&startDate:startDate&endDate:endDate&tripExpenses:tripExpenses&people:people&currency:currency',
    //   //path: '/PersonalPage?tripCodeA57mUKDFHF9nEpskfkDw&budget2000&tripNameDubai&startDate2023-03-21&endDate2023-03-30&tripExpenses["YGqHHMg1r2okgUSd7TpD","lDxrkBO0Hx3eSLZQNDKf","jNyn7gwEosPd9mY6vPQc"]&people["wIJSfQo547OOJWXNVhUmWZBDryi2"]&currencyUSD',
    //   path: '/PersonalPage',
    //   name: 'PersonalPage',
    //   //alias: '/PersonalPage',
    //   component: PersonalPage,
    //   props:true
    // },
    // {
    //   path:'/GroupPage',
    //   name: 'GroupPage',
    //   component: GroupPage,

    // },
    {
      path:'/Profile',
      name: 'Profile',
      component: Profile
    },
    {
      path:'/Dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
  ]
})


// //Navigation guard to prevent unauthenticated users from accessing pages like InputPage and Trips
// router.beforeEach((to, from, next) => {
//   const publicPages = ['/','/register'];
//   const authRequired = !publicPages.includes(to.path);
//   //wait till the user is loaded

//   const loggedIn = localStorage.getItem('user');
//   if (authRequired && !loggedIn) {
//     alert("You must be logged in to access this page")
//     return next('/');
//   }
//   next();
// })

export default router
