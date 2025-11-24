<template>
  <div class="max-w-4xl mx-auto px-6 py-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">About / Help / Contact</h1>
    <section class="card p-6 mb-6">
      <h2 class="text-xl font-semibold mb-3">Submit Feedback</h2>
      <div class="grid gap-4">
        <input v-model="subject" placeholder="Subject"
          class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-darkbg px-3 py-2" />
        <textarea v-model="message" rows="4" placeholder="Message..."
          class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-darkbg px-3 py-2"></textarea>
        <button @click="submit" class="btn btn-primary">Submit Feedback</button>
      </div>
    </section>
    <section class="card p-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-xl font-semibold">Feedback Submissions</h2>
        <small class="text-gray-500 dark:text-gray-400">(Admins can mark as reviewed)</small>
      </div>
      <div v-if="list.length === 0" class="text-gray-500 dark:text-gray-400">No feedback yet.</div>
      <div v-for="f in list" :key="f.id" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3">
        <div class="flex items-center justify-between mb-1">
          <span class="font-semibold">{{ f.subject }}</span>
          <span class="text-xs rounded-full px-2 py-1"
            :class="f.status === 'Reviewed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'">{{
              f.status }}</span>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-2">{{ f.message }}</p>
        <button v-if="isAdmin && f.status === 'Pending'" @click="markReviewed(f.id)" class="btn btn-outline">Mark as
          Reviewed</button>
      </div>
    </section>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const subject = ref(''); const message = ref(''); const list = ref([])
const isAdmin = JSON.parse(localStorage.getItem('session') || '{}')?.role === 'Admin'
onMounted(() => { list.value = JSON.parse(localStorage.getItem('feedback') || '[]') })
function submit() { if (!subject.value || !message.value) return; const items = list.value; items.push({ id: Date.now(), subject: subject.value, message: message.value, status: 'Pending' }); list.value = items; localStorage.setItem('feedback', JSON.stringify(items)); subject.value = message.value = '' }
function markReviewed(id) { const f = list.value.find(x => x.id === id); if (f) f.status = 'Reviewed'; localStorage.setItem('feedback', JSON.stringify(list.value)) }
</script>
