<template>
  <div>
    <h1>Новостной сайт</h1>
    
    <div style="background: #eee; padding: 8px; margin-bottom: 15px;">
      <button @click="testApi" style="padding: 5px 10px; margin-right: 10px;">
        Проверить API
      </button>
      <span v-if="testResult" style="color: #333;">{{ testResult }}</span>
    </div>
    
    <div v-if="categories.length > 0">
      <h3>Категории:</h3>
      <div style="margin-bottom: 15px;">
        <button 
          @click="selectCategory(null)"
          :style="selectedCategory === null ? 'background: #007bff; color: white; padding: 5px 10px; border: 1px solid #007bff; margin-right: 5px;' : 'background: #eee; padding: 5px 10px; border: 1px solid #ccc; margin-right: 5px;'"
        >
          Все
        </button>
        <button 
          v-for="category in categories" 
          :key="category"
          @click="selectCategory(category)"
          :style="selectedCategory === category ? 'background: #007bff; color: white; padding: 5px 10px; border: 1px solid #007bff; margin-right: 5px;' : 'background: #eee; padding: 5px 10px; border: 1px solid #ccc; margin-right: 5px;'"
        >
          {{ category }}
        </button>
      </div>
    </div>
    
    <div v-if="loading" style="text-align: center; padding: 20px;">
      Загрузка...
    </div>
    
    <div v-if="!loading && articles.length === 0" style="text-align: center; padding: 20px; color: #666;">
      Статей нет
    </div>
    
    <div v-if="!loading && articles.length > 0">
      <h3>Статьи:</h3>
      <ArticleCard 
        v-for="article in articles" 
        :key="article.id" 
        :article="article"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '@/components/ArticleCard.vue'

const articles = ref([])
const categories = ref([])
const loading = ref(true)
const selectedCategory = ref(null)
const testResult = ref('')

const loadArticles = async () => {
  try {
    loading.value = true
    let url = '/api/public/articles'
    if (selectedCategory.value) {
      url += `?category=${encodeURIComponent(selectedCategory.value)}`
    }
    
    const response = await fetch(url)
    const data = await response.json()
    articles.value = data
  } catch (error) {
    console.log('Ошибка загрузки статей:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await fetch('/api/categories')
    const data = await response.json()
    categories.value = data
  } catch (error) {
    console.log('Ошибка загрузки категорий:', error)
  }
}

const selectCategory = (category) => {
  selectedCategory.value = category
  loadArticles()
}

const testApi = async () => {
  try {
    const response = await fetch('/api/categories')
    const data = await response.json()
    testResult.value = `OK: ${JSON.stringify(data)}`
  } catch (error) {
    testResult.value = `Ошибка: ${error.message}`
  }
}

onMounted(() => {
  loadCategories()
  loadArticles()
})
</script>