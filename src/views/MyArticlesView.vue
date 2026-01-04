<template>
  <div>
    <h2>Мои статьи</h2>
    
    <div v-if="!isAuthenticated" style="text-align: center; padding: 20px;">
      <p>Для просмотра статей нужно <router-link to="/login">войти</router-link></p>
    </div>
    
    <div v-else>
      <div v-if="loading" style="text-align: center; padding: 20px;">
        Загрузка...
      </div>
      
      <div v-if="!loading && articles.length === 0" style="text-align: center; padding: 20px;">
        <p>У вас пока нет статей</p>
        <router-link to="/articles/create" style="padding: 8px 15px; background: #007bff; color: white; text-decoration: none;">
          Создать первую статью
        </router-link>
      </div>
      
      <div v-if="!loading && articles.length > 0">
        <div v-for="article in articles" :key="article.id" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 15px;">
          <h3 style="margin-top: 0;">{{ article.title }}</h3>
          
          <div style="font-size: 14px; color: #666; margin-bottom: 10px;">
            <span style="margin-right: 15px;">Категория: {{ article.category }}</span>
            <span>Дата: {{ formatDate(article.created_date) }}</span>
          </div>
          
          <div style="display: flex; gap: 10px; margin-top: 15px;">
            <router-link :to="`/article/${article.id}`" style="padding: 5px 10px; background: #007bff; color: white; text-decoration: none;">
              Просмотреть
            </router-link>
            
            <router-link :to="`/articles/edit/${article.id}`" style="padding: 5px 10px; background: #ffc107; color: black; text-decoration: none;">
              Редактировать
            </router-link>
            
            <button 
              @click="deleteMyArticle(article.id)"
              style="padding: 5px 10px; background: #dc3545; color: white; border: none;"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { articleApi } from '@/api/articles'

const { isAuthenticated } = useAuth()

const articles = ref([])
const loading = ref(false)

const loadMyArticles = async () => {
  try {
    loading.value = true
    const response = await articleApi.getAllArticles()
    articles.value = response.data
  } catch (err) {
    console.log('Ошибка загрузки статей:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

const deleteMyArticle = async (id) => {
  if (!confirm('Удалить статью?')) return
  
  try {
    await articleApi.deleteArticle(id)
    articles.value = articles.value.filter(article => article.id !== id)
  } catch (err) {
    console.log('Ошибка удаления:', err)
    alert('Не удалось удалить статью')
  }
}

onMounted(() => {
  if (isAuthenticated.value) {
    loadMyArticles()
  }
})
</script>