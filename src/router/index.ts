import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/play'
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test/index.vue')
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('../views/playground/index.vue')
    }
  ]
})

export default router
