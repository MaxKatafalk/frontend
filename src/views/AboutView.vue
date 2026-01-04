<template>
  <div>
    <h1>О сайте</h1>
    
    <div style="line-height: 1.5;">
      <p>Это новостной сайт, созданный как учебный проект.</p>
      
      <h3>Используемые технологии:</h3>
      <ul>
        <li>Frontend: Vue.js</li>
        <li>Backend: Flask</li>
        <li>База данных: SQLite</li>
        <li>Аутентификация: JWT</li>
      </ul>
      
      <h3>Возможности:</h3>
      <ul>
        <li>Чтение новостей</li>
        <li>Регистрация и вход</li>
        <li>Создание статей</li>
        <li>Комментирование</li>
      </ul>
      
      <h3>API:</h3>
      <p>API доступно по адресу /api/</p>
      <ul>
        <li>GET /api/public/articles - список статей</li>
        <li>GET /api/public/articles/{id} - статья</li>
        <li>POST /api/auth/register - регистрация</li>
        <li>POST /api/auth/login - вход</li>
      </ul>
      
      <p style="margin-top: 20px; font-style: italic;">
        Учебный проект по веб-разработке.
      </p>
    </div>
  </div>
</template>