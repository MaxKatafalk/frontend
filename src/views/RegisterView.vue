<template>
  <div>
    <h2>Регистрация</h2>
    
    <div v-if="error" style="color: red; background: #ffeeee; padding: 10px; margin: 10px 0;">
      Ошибка: {{ error }}
    </div>
    
    <form @submit.prevent="handleSubmit">
      <div style="margin: 10px 0;">
        <label>Имя:</label><br>
        <input 
          type="text" 
          v-model="form.name" 
          required 
          style="width: 300px; padding: 5px;"
          :disabled="isLoading"
        >
      </div>
      
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
      
      <div style="margin: 10px 0;">
        <label>Подтвердите пароль:</label><br>
        <input 
          type="password" 
          v-model="form.confirmPassword" 
          required 
          style="width: 300px; padding: 5px;"
          :disabled="isLoading"
        >
        <div v-if="!passwordsMatch && form.confirmPassword" style="color: red; font-size: 12px;">
          Пароли не совпадают!
        </div>
      </div>
      
      <button 
        type="submit" 
        :disabled="isLoading || !passwordsMatch"
        style="padding: 8px 20px; background: #2196F3; color: white; border: none;"
      >
        <span v-if="isLoading">Загрузка...</span>
        <span v-else>Зарегистрироваться</span>
      </button>
    </form>
    
    <div style="margin-top: 20px;">
      Уже есть аккаунт? <router-link to="/login">Войти</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { register, isLoading, error } = useAuth()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordsMatch = computed(() => {
  return form.password === form.confirmPassword
})

const handleSubmit = async () => {
  if (!passwordsMatch.value) return
  
  await register(form.name, form.email, form.password)
}
</script>