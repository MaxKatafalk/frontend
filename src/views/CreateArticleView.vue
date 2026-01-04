<template>
  <div>
    <h2>Создать статью</h2>
    
    <div v-if="!isAuthenticated" style="text-align: center; padding: 20px;">
      <p>Для создания статьи нужно <router-link to="/login">войти</router-link></p>
    </div>
    
    <div v-else>
      <form @submit.prevent="submitArticle">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Заголовок:</label>
          <input 
            type="text" 
            v-model="form.title" 
            required 
            style="width: 100%; padding: 8px; border: 1px solid #ccc;"
          >
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Категория:</label>
          <select 
            v-model="form.category" 
            style="width: 100%; padding: 8px; border: 1px solid #ccc;"
          >
            <option value="general">Общее</option>
            <option value="news">Новости</option>
            <option value="sport">Спорт</option>
            <option value="tech">Технологии</option>
            <option value="culture">Культура</option>
          </select>
        </div>
        
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px;">Текст статьи:</label>
          <textarea 
            v-model="form.text" 
            required 
            rows="10"
            style="width: 100%; padding: 8px; border: 1px solid #ccc;"
          ></textarea>
        </div>
        
        <div v-if="error" style="color: red; background: #ffeeee; padding: 10px; margin-bottom: 15px;">
          {{ error }}
        </div>
        
        <div v-if="success" style="color: green; background: #eeffee; padding: 10px; margin-bottom: 15px;">
          Статья создана! <router-link :to="`/article/${newArticleId}`">Посмотреть</router-link>
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="loading"
            style="padding: 10px 20px; background: #28a745; color: white; border: none; margin-right: 10px;"
          >
            <span v-if="loading">Создание...</span>
            <span v-else>Создать статью</span>
          </button>
          <router-link to="/" style="padding: 10px 20px; background: #6c757d; color: white; text-decoration: none;">
            Отмена
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { articleApi } from '@/api/articles'

const router = useRouter()
const { isAuthenticated } = useAuth()

const form = ref({
  title: '',
  category: 'general',
  text: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const newArticleId = ref(null)

const submitArticle = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    const response = await articleApi.createArticle(form.value)
    newArticleId.value = response.data.id
    success.value = true
    
    setTimeout(() => {
      router.push(`/article/${newArticleId.value}`)
    }, 2000)
    
  } catch (err) {
    error.value = err.response?.data?.error || 'Ошибка создания статьи'
  } finally {
    loading.value = false
  }
}
</script>