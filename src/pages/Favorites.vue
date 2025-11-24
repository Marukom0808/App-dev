<template>
  <div class="max-w-7xl mx-auto px-6 py-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">My Favorites</h1>
    <div v-if="favoriteRooms.length === 0" class="text-gray-500 dark:text-gray-400">No favorites yet.</div>
    <div class="grid md:grid-cols-3 gap-4">
      <div v-for="r in favoriteRooms" :key="r.id" class="card p-4">
        <div class="flex items-center justify-between mb-2">
          <span class="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{{ r.type }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Floor {{ r.floorId }}</span>
        </div>
        <h3 class="font-semibold text-lg mb-2">{{ r.name }}</h3>
        <button @click="removeFav(r.id)" class="btn btn-outline">Remove from Favorites</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))
const rooms = ref([{ id: 1, name: 'Lecture 1701', type: 'Lecture Room', floorId: 17 }, { id: 2, name: 'Lab 1802', type: 'Lab', floorId: 18 }, { id: 3, name: 'Office 1903', type: 'Office', floorId: 19 }])
const favoriteRooms = computed(() => rooms.value.filter(r => favorites.value.includes(r.id)))
function removeFav(id) { favorites.value = favorites.value.filter(x => x !== id); localStorage.setItem('favorites', JSON.stringify(favorites.value)) }
</script>
