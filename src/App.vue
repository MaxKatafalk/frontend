<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Главная</router-link> |
      <router-link to="/about">О сайте</router-link> |
      <router-link to="/login">Вход</router-link> |
      <router-link to="/register">Регистрация</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script setup>
// Пустой, только шаблон
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  margin-bottom: 30px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
}

nav a:hover {
  color: #007bff;
}
</style>