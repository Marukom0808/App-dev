import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './main.css'
const theme = localStorage.getItem('theme') || 'light'; document.documentElement.classList.toggle('dark', theme === 'dark')
createApp(App).use(router).mount('#app')
