<template>
  <div style="border: 1px solid black; padding: 10px; margin-bottom: 15px; background: white;">
    <h3 style="margin-top: 0; color: #333;">{{ article.title }}</h3>
    
    <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
      <span style="margin-right: 15px;">Категория: {{ article.category }}</span>
      <span style="margin-right: 15px;">Дата: {{ formatDate(article.created_date) }}</span>
      <span>Автор: {{ article.author_name }}</span>
    </div>
    
    <div style="margin: 10px 0; line-height: 1.4; color: #444;">
      {{ article.preview || article.text.substring(0, 150) }}...
    </div>
    
    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
      <router-link :to="`/article/${article.id}`" style="color: blue; text-decoration: none;">
        Читать дальше
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}
</script>