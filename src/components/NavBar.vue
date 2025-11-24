<!-- Navbar.vue -->
<script setup>
import logo from '@/assets/logo.png'
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';

const route = useRoute();
const router = useRouter();
const user = ref(null);
const theme = ref(localStorage.getItem('theme') || 'light');

// dynamically load user every time session changes
function loadUser() {
  user.value = JSON.parse(localStorage.getItem('session') || 'null');
}
onMounted(loadUser);

// Watch localStorage for session updates (even without page reload)
window.addEventListener('storage', loadUser);
watch(() => localStorage.getItem('session'), loadUser);

// navbar refresh when login
window.addEventListener('session-updated', loadUser);

function isActive(path) {
  return route.path === path;
}

function goLogin() {
  router.push('/login');
}

function logout() {
  localStorage.removeItem('session');
  user.value = null;
  router.push('/login');
}

function applyTheme() {
  document.documentElement.classList.toggle('dark', theme.value === 'dark');
  localStorage.setItem('theme', theme.value);
}

// apply saved theme on page load
onMounted(applyTheme);
</script>

<template>
  <nav class="navbar">
    <div class="navbar-container">

      <!-- BRAND WITH LOGO -->
      <div class="navbar-brand">
        <img :src="logo" alt="SCNS Logo" class="brand-logo" />
        <span class="brand-highlight">UST-SCNS</span>
      </div>

      <div class="nav-items">
        <!-- Home -->
        <RouterLink to="/" class="nav-link" :class="{ 'nav-link--active': isActive('/') }">
          Home
        </RouterLink>

        <!-- Favorites -->
        <RouterLink v-if="user" to="/favorites" class="nav-link" :class="{ 'nav-link--active': isActive('/favorites') }">
          My Favorites
        </RouterLink>

        <!-- Profile -->
        <RouterLink v-if="user" to="/profile" class="nav-link" :class="{ 'nav-link--active': isActive('/profile') }">
          Profile
        </RouterLink>

        <!-- Admin Dashboard -->
        <RouterLink v-if="user?.role === 'Admin'" to="/admin" class="nav-link"
          :class="{ 'nav-link--active': isActive('/admin') }">
          Admin Dashboard
        </RouterLink>

        <!-- Help -->
        <RouterLink to="/feedback" class="nav-link" :class="{ 'nav-link--active': isActive('/feedback') }">
          Help
        </RouterLink>

        <!-- Login/Logout -->
        <button v-if="!user" @click="goLogin" class="btn btn-primary">
          Login
        </button>

        <button v-else @click="logout" class="btn btn-outline">
          Logout
        </button>

        <!-- Theme toggle -->
        <select v-model="theme" @change="applyTheme" class="theme-select">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  </nav>
</template>

<!-- LIGHT MODE STYLES -->
<style scoped>
.navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.navbar-container {
  width: 100%;
  max-width: 1280px; 
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* BRAND */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  object-fit: cover;
}

.brand-highlight {
  color: #ffc814;
  font-weight: 800;
  font-size: 1.25rem;
}

/* NAV LINKS */
.nav-items {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-link {
  padding: 8px 12px;
  border-radius: 10rem;
  font-size: 0.9rem;
  color: #374151;
  text-decoration: none;
}

.nav-link:hover {
  background-color: #fef3c7;
  color: #111827;
}

.nav-link--active {
  background-color: #ffc814;
  color: #111827;
}

/* BUTTONS */
.btn {
  padding: 8px 14px;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn-primary {
  background-color: #ffc814;
  color: #2d3136;
}

.btn-primary:hover {
  background-color: #e0ac10;
}

.btn-outline {
  background-color: transparent;
  color: #374151;
  border: 1px solid #cbd5e1;
}

.btn-outline:hover {
  background-color: #f9fafb;
}

/* Theme selector */
.theme-select {
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #111827;
  padding: 4px 8px;
  font-size: 0.85rem;
}
</style>

<!-- DARK MODE (GLOBAL, NOT SCOPED) -->
<style>
html.dark body {
  background-color: #020617;
  color: #f9fafb;
}

html.dark .navbar {
  background-color: #020617;
  border-color: #1f2937;
}

html.dark .navbar-brand {
  color: #f9fafb;
}

html.dark .brand-highlight {
  color: #ffc814;
}

html.dark .brand-logo {
  filter: brightness(0.85);
}

html.dark .nav-link {
  color: #e5e7eb;
}

html.dark .nav-link:hover {
  background-color: #1f2937;
  color: #f9fafb;
}

html.dark .nav-link--active {
  background-color: #ffc814;
  color: #111827;
}

html.dark .btn-outline {
  color: #e5e7eb;
  border-color: #4b5563;
}

html.dark .theme-select {
  background-color: #020617;
  color: #f9fafb;
  border-color: #4b5563;
}
</style>
