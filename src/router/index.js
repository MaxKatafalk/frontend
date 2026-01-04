import { createRouter, createWebHashHistory } from 'vue-router'
import { requireAuth, requireGuest } from './guards'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      beforeEnter: requireGuest
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      beforeEnter: requireGuest
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/articles/create',
      name: 'create-article',
      component: () => import('@/views/CreateArticleView.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/articles/my',
      name: 'my-articles',
      component: () => import('@/views/MyArticlesView.vue'),
      beforeEnter: requireAuth
    }
  ]
})

export default router