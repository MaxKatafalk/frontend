<template>
  <div>
    <div v-if="loading" style="text-align: center; padding: 20px;">
      Загрузка...
    </div>
    
    <div v-if="!loading && !article" style="text-align: center; padding: 20px;">
      <h3>Статья не найдена</h3>
      <router-link to="/">На главную</router-link>
    </div>
    
    <div v-if="!loading && article">
      <h2>Редактировать статью</h2>
      
      <div v-if="errorMessage" style="color: red; background: #ffeeee; padding: 10px; margin-bottom: 15px;">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" style="color: green; background: #eeffee; padding: 10px; margin-bottom: 15px;">
        {{ successMessage }}
      </div>
      
      <form @submit.prevent="updateArticle">
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
        
        <div>
          <button 
            type="submit" 
            :disabled="updating"
            style="padding: 10px 20px; background: #007bff; color: white; border: none; margin-right: 10px;"
          >
            <span v-if="updating">Сохранение...</span>
            <span v-else>Сохранить</span>
          </button>
          
          <button 
            type="button" 
            @click="deleteArticle"
            :disabled="deleting"
            style="padding: 10px 20px; background: #dc3545; color: white; border: none; margin-right: 10px;"
          >
            <span v-if="deleting">Удаление...</span>
            <span v-else>Удалить</span>
          </button>
          
          <router-link :to="`/article/${articleId}`" style="padding: 10px 20px; background: #6c757d; color: white; text-decoration: none;">
            Отмена
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleApi } from '@/api/articles'

const route = useRoute()
const router = useRouter()

const articleId = route.params.id
const loading = ref(true)
const updating = ref(false)
const deleting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const article = ref(null)

const form = ref({
  title: '',
  category: 'general',
  text: ''
})

const loadArticle = async () => {
  try {
    loading.value = true
    const response = await articleApi.getArticle(articleId)
    article.value = response.data
    form.value = {
      title: response.data.title,
      category: response.data.category,
      text: response.data.text
    }
  } catch (err) {
    console.log('Ошибка загрузки статьи:', err)
    article.value = null
  } finally {
    loading.value = false
  }
}

const updateArticle = async () => {
  updating.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    await articleApi.updateArticle(articleId, form.value)
    successMessage.value = 'Статья обновлена'
    setTimeout(() => {
      router.push(`/article/${articleId}`)
    }, 1500)
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Ошибка обновления'
  } finally {
    updating.value = false
  }
}

const deleteArticle = async () => {
  if (!confirm('Удалить статью?')) return
  
  deleting.value = true
  try {
    await articleApi.deleteArticle(articleId)
    router.push('/articles/my')
  } catch (err) {
    errorMessage.value = err.response?.data?.error || 'Ошибка удаления'
    deleting.value = false
  }
}

onMounted(() => {
  loadArticle()
})
</script>