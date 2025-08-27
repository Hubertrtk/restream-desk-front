import CreateTicket from '@/views/CreateTicket.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/createticket',
      name: 'createticket',
      component: CreateTicket,
    },
  ],
})

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('wtauthuser') // tu ustaw nazwę swojego klucza
//   if (!token && to.name !== 'login') {
//     // Jeśli brak klucza i próbujemy wejść na stronę inną niż login → przekieruj
//     next({ name: 'login' })
//   } else {
//     // Jeśli jest klucz lub idziemy na login → kontynuuj
//     next()
//   }
// })

export default router
