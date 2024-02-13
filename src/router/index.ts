import { createRouter, createWebHistory } from 'vue-router'
import login from '@/components/login.vue'
import streaming from '@/components/streaming.vue'
import editPageVue from '@/components/editPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/streaming',
      name: 'streaming',
      component: streaming
    },
    {
      path: '/edit',
      name: 'edit',
      component: editPageVue
    }
  ]
})

export default router
