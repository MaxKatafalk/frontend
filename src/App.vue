<template>
  <div>
    <div style="background: #f0f0f0; padding: 10px; margin-bottom: 20px;">
      <router-link to="/" style="margin-right: 10px;">Главная</router-link> |
      <router-link to="/about" style="margin: 0 10px;">О сайте</router-link> |
      
      <template v-if="isAuthenticated">
        <router-link to="/articles/create" style="margin: 0 10px;">Новая статья</router-link> |
        <router-link to="/articles/my" style="margin: 0 10px;">Мои статьи</router-link> |
        <a href="#" @click.prevent="logout" style="margin-left: 10px;">Выйти ({{ user?.name }})</a>
      </template>
      <template v-else>
        <router-link to="/login" style="margin: 0 10px;">Вход</router-link> |
        <router-link to="/register">Регистрация</router-link>
      </template>
    </div>
    
    <router-view/>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, logout, getCurrentUser } = useAuth()

onMounted(() => {
  if (localStorage.getItem('access_token')) {
    getCurrentUser()
  }
})
</script>