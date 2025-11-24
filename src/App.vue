<!-- App.vue -->
<template>
  <div class="min-h-screen page-container">
    <SplashScreen v-if="showSplash" />

    <template v-else>
      <NavBar />

      <main class="animate-fadein content-wrapper">
        <RouterView />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import SplashScreen from './components/SplashScreen.vue'

const showSplash = ref(true)

onMounted(() => {
  setTimeout(() => {
    showSplash.value = false
  }, 1500)
})
</script>

<style>

html.dark body,
html.dark #app,
html.dark .page-container,
html.dark .content-wrapper,
html.dark main {
  background-color: #020617;   /* deep navy / dark mode */
  color: #f9fafb;              /* readable white text */
}

/* ensures all pages follow dark background */
.page-container,
.content-wrapper {
  background-color: inherit;
}

/* optional: make fade-in smooth in dark mode */
.animate-fadein {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
</style>
