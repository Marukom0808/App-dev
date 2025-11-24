<!-- AdminDashboard.vue -->
<template>
  <div class="admin-container">
    <h1 class="admin-title">Admin Dashboard</h1>

    <!-- Floor Management -->
    <section class="card section-block">
      <div class="section-header">
        <h2 class="section-title">Floor Management</h2>
        <button @click="openFloor()" class="btn btn-primary">Add Floor</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Map</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="f in floors" :key="f.id">
            <td>{{ f.number }}</td>
            <td>{{ f.mapImage || '—' }}</td>

            <td>
              <button class="text-blue-600 mr-2" @click="openFloor(f)">Edit</button>
              <button class="text-red-600" @click="removeFloor(f.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Room Management -->
    <section class="card section-block">
      <div class="section-header">
        <h2 class="section-title">Room Management</h2>
        <button @click="openRoom()" class="btn btn-primary">Add Room</button>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Floor</th>
            <th>Coordinates</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="r in rooms" :key="r.id">
            <td>{{ r.name }}</td>
            <td>{{ r.type }}</td>
            <td>{{ r.floorId }}</td>
            <td>{{ r.coordinates || '100,100' }}</td>

            <td>
              <button class="text-blue-600 mr-2" @click="openRoom(r)">Edit</button>
              <button class="text-red-600" @click="removeRoom(r.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Modal -->
    <div v-if="modal" class="modal-bg">
      <div class="modal-card">
        <button @click="modal = null" class="modal-close">✕</button>

        <h3 class="modal-title">
          {{ modal === 'floor'
            ? (editing ? 'Edit Floor' : 'Add Floor')
            : (editing ? 'Edit Room' : 'Add Room')
          }}
        </h3>

        <div class="modal-grid">
          <!-- Floor Form -->
          <template v-if="modal === 'floor'">
            <input
              v-model="form.number"
              placeholder="Floor number (17–20)"
              class="input-field"
            />

            <input
              v-model="form.mapImage"
              placeholder="Map image URL (optional)"
              class="input-field"
            />
          </template>

          <!-- Room Form -->
          <template v-else>
            <input
              v-model="form.name"
              placeholder="Room name"
              class="input-field"
            />

            <select v-model="form.type" class="input-field">
              <option value="">Type</option>
              <option>Lecture Room</option>
              <option>Lab</option>
              <option>Office</option>
            </select>

            <select v-model="form.floorId" class="input-field">
              <option v-for="f in floors" :key="f.id" :value="f.number">
                {{ f.number }}
              </option>
            </select>

            <input
              v-model="form.coordinates"
              placeholder="Coordinates (x,y)"
              class="input-field"
            />
          </template>

          <div class="modal-actions">
            <button class="btn btn-primary" @click="save">Save</button>
            <button class="btn btn-outline" @click="modal = null">Cancel</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

/* --------------------- Data --------------------- */
const floors = ref([
  { id: 17, number: 17, mapImage: '' },
  { id: 18, number: 18, mapImage: '' },
  { id: 19, number: 19, mapImage: '' },
  { id: 20, number: 20, mapImage: '' }
])

const rooms = ref([
  { id: 1, name: 'Lecture 1701', type: 'Lecture Room', floorId: 17, coordinates: '120,120' }
])

const modal = ref(null)
const form = ref({})
const editing = ref(false)

/* --------------------- Floor / Room Actions --------------------- */
function openFloor(f = null) {
  modal.value = 'floor'
  editing.value = !!f
  form.value = f ? { ...f } : { number: '', mapImage: '' }
}

function openRoom(r = null) {
  modal.value = 'room'
  editing.value = !!r
  form.value = r
    ? { ...r }
    : { name: '', type: '', floorId: 17, coordinates: '100,100' }
}

function save() {
  if (modal.value === 'floor') {
    if (editing.value) {
      const i = floors.value.findIndex(x => x.number == form.value.number)
      if (i > -1) floors.value[i] = { ...floors.value[i], ...form.value }
    } else {
      floors.value.push({ id: form.value.number, ...form.value })
    }
  } else {
    if (editing.value) {
      const i = rooms.value.findIndex(x => x.id == form.value.id)
      if (i > -1) rooms.value[i] = { ...rooms.value[i], ...form.value }
    } else {
      rooms.value.push({ id: Date.now(), ...form.value })
    }
  }

  modal.value = null
}

function removeFloor(id) {
  floors.value = floors.value.filter(f => f.id !== id && f.number !== id)
}

function removeRoom(id) {
  rooms.value = rooms.value.filter(r => r.id !== id)
}
</script>

<style scoped>
/* MAIN CONTAINER */
.admin-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
}

.admin-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111827;
}

/* SECTION CARD */
.section-block {
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
}

/* TABLE */
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  text-align: left;
  padding: 10px;
  font-weight: 600;
  background: #f3f4f6;
}

.table td {
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
}

/* MODAL */
.modal-bg {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.modal-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  color: #6b7280;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.modal-grid {
  display: grid;
  gap: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

/* INPUT FIELDS */
.input-field {
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
}

.input-field:focus {
  border-color: #ffc814;
  outline: none;
}

/* BUTTONS (already from Navbar global style) */
</style>
