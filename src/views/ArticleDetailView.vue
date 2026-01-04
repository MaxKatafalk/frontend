<template>
  <div>
    <div v-if="loading" style="text-align: center; padding: 20px">Загрузка...</div>

    <div v-if="!loading && !article" style="text-align: center; padding: 20px">
      <h3>Статья не найдена</h3>
      <router-link to="/">На главную</router-link>
    </div>

    <div v-if="!loading && article">
      <div style="margin-bottom: 15px">
        <router-link to="/" style="color: blue; text-decoration: none">← Назад</router-link>
      </div>

      <h1>{{ article.title }}</h1>

      <div
        style="
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        "
      >
        <span style="margin-right: 15px">Категория: {{ article.category }}</span>
        <span style="margin-right: 15px">Дата: {{ formatDate(article.created_date) }}</span>
        <span>Автор: {{ article.author_name }}</span>
      </div>

      <div style="line-height: 1.5; margin-bottom: 20px; white-space: pre-wrap">
        {{ article.text }}
      </div>

      <div
        v-if="isAuthenticated && article.user_id === currentUserId"
        style="margin-bottom: 20px; padding-top: 15px; border-top: 1px solid #ddd"
      >
        <router-link
          :to="`/articles/edit/${article.id}`"
          style="
            padding: 8px 15px;
            background: #ffc107;
            color: black;
            text-decoration: none;
            margin-right: 10px;
          "
        >
          Редактировать
        </router-link>
        <button
          @click="deleteArticle"
          style="padding: 8px 15px; background: #dc3545; color: white; border: none"
        >
          Удалить
        </button>
      </div>

      <div style="border-top: 2px solid #ddd; padding-top: 15px">
        <h3>Комментарии</h3>

        <div v-if="isAuthenticated" style="margin-bottom: 15px">
          <h4>Добавить комментарий:</h4>
          <form @submit.prevent="submitComment">
            <textarea
              v-model="newComment.text"
              placeholder="Текст комментария"
              rows="3"
              style="width: 100%; padding: 8px; margin-bottom: 8px; border: 1px solid #ccc"
              required
            ></textarea>
            <div>
              <input
                type="text"
                v-model="newComment.author_name"
                placeholder="Ваше имя"
                style="
                  width: 200px;
                  padding: 5px;
                  margin-bottom: 8px;
                  margin-right: 10px;
                  border: 1px solid #ccc;
                "
                required
              />
              <button
                type="submit"
                :disabled="submittingComment"
                style="padding: 6px 15px; background: #007bff; color: white; border: none"
              >
                <span v-if="submittingComment">Отправка...</span>
                <span v-else>Отправить</span>
              </button>
            </div>
          </form>
        </div>
        <div v-else style="margin-bottom: 15px">
          <router-link to="/login">Войдите</router-link> чтобы комментировать
        </div>

        <div v-if="article.comments && article.comments.length > 0">
          <div
            v-for="comment in article.comments"
            :key="comment.id"
            style="border: 1px solid #eee; padding: 10px; margin-bottom: 10px"
          >
            <div style="font-size: 14px; margin-bottom: 5px">
              <strong>{{ comment.author_name }}</strong>
              <span style="color: #666; margin-left: 10px">{{ formatDate(comment.date) }}</span>
            </div>
            <div>{{ comment.text }}</div>
          </div>
        </div>
        <div v-else style="text-align: center; padding: 15px; color: #666">Нет комментариев</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { articleApi } from '@/api/articles'

const route = useRoute()
const router = useRouter()
const { isAuthenticated } = useAuth()

const article = ref(null)
const loading = ref(true)
const newComment = ref({
  text: '',
  author_name: '',
})
const submittingComment = ref(false)

const articleId = computed(() => route.params.id)
const currentUserId = computed(() => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  return currentUser.id || null
})

const loadArticle = async () => {
  try {
    loading.value = true
    const response = await articleApi.getPublicArticle(articleId.value)
    article.value = response.data

    if (isAuthenticated.value) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      newComment.value.author_name = userData.name || ''
    }
  } catch (err) {
    console.log('Ошибка загрузки статьи:', err)
    article.value = null
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

const submitComment = async () => {
  if (!newComment.value.text.trim() || !newComment.value.author_name.trim()) {
    alert('Заполните все поля')
    return
  }

  try {
    submittingComment.value = true

    const response = await fetch('/api/public/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: newComment.value.text,
        author_name: newComment.value.author_name,
        article_id: articleId.value,
      }),
    })

    if (!response.ok) {
      throw new Error('Ошибка отправки')
    }

    newComment.value.text = ''
    await loadArticle()
  } catch (error) {
    console.log('Ошибка отправки комментария:', error)
    alert('Ошибка отправки')
  } finally {
    submittingComment.value = false
  }
}

const deleteArticle = async () => {
  if (!confirm('Удалить статью?')) return

  try {
    await articleApi.deleteArticle(articleId.value)
    router.push('/')
  } catch (err) {
    console.log('Ошибка удаления:', err)
    alert('Не удалось удалить статью')
  }
}

onMounted(() => {
  loadArticle()
})
</script>
