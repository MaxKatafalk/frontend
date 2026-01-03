<template>
  <div>
    <h1>Тест API</h1>
    <button @click="testApi">Проверить API</button>
    <div v-if="result">{{ result }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const result = ref('')

async function testApi() {
  try {
    const response = await fetch('/api/categories')
    const data = await response.json()
    result.value = 'УСПЕХ: ' + JSON.stringify(data)
  } catch (error) {
    result.value = 'ОШИБКА: ' + error.message
  }
}
</script>