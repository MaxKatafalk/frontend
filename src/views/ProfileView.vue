<template>
  <div>
    <h2>Профиль</h2>
    <div v-if="user">
      <p><strong>Имя:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
</script>