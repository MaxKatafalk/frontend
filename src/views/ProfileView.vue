<template>
  <div>
    <h2>Профиль</h2>
    <div v-if="user">
      <p>Имя: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>