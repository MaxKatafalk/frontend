<template>
  <div>
    <h2>Вход</h2>
    
    <div v-if="error" style="color: red; background: #ffeeee; padding: 10px; margin: 10px 0;">
      Ошибка: {{ error }}
    </div>
    
    <form @submit.prevent="handleSubmit">
      <div style="margin: 10px 0;">
        <label>Email:</label><br>
        <input 
          type="email" 
          v-model="form.email" 
          required 
          style="width: 300px; padding: 5px;"
          :disabled="isLoading"
        >
      </div>
      
      <div style="margin: 10px 0;">
        <label>Пароль:</label><br>
        <input 
          type="password" 
          v-model="form.password" 
          required 
          style="width: 300px; padding: 5px;"
          :disabled="isLoading"
        >
      </div>
      
      <button 
        type="submit" 
        :disabled="isLoading"
        style="padding: 8px 20px; background: #4CAF50; color: white; border: none;"
      >
        <span v-if="isLoading">Загрузка...</span>
        <span v-else>Войти</span>
      </button>
    </form>
    
    <div style="margin-top: 20px;">
      Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, isLoading, error } = useAuth()

const form = reactive({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  await login(form.email, form.password)
}
</script>