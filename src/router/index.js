
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Favorites from '../pages/Favorites.vue'
import Feedback from '../pages/Feedback.vue'
import AdminDashboard from '../pages/AdminDashboard.vue'
import Profile from '../pages/Profile.vue'
import Login from '../pages/Login.vue'
import Signup from '../pages/Signup.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/favorites', component: Favorites },
  { path: '/feedback', component: Feedback },
  { path: '/admin', component: AdminDashboard },
  { path: '/profile', component: Profile },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
]
export default createRouter({ history: createWebHistory(), routes })
