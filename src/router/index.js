import { createRouter, createWebHashHistory } from 'vue-router'

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
      path: '/article/:id',
      name: 'article',
      component: () => import('@/views/ArticleDetailView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue')
    },
    {
      path: '/articles/create',
      name: 'create-article',
      component: () => import('@/views/CreateArticleView.vue')
    },
    {
      path: '/articles/my',
      name: 'my-articles',
      component: () => import('@/views/MyArticlesView.vue')
    },
    {
      path: '/articles/edit/:id',
      name: 'edit-article',
      component: () => import('@/views/EditArticleView.vue')
    }
  ]
})

export default router