<!-- Profile.vue -->
<template>
  <div class="profile-wrapper">
    <h1 class="profile-title">Profile / Account Settings</h1>

    <!-- My Account -->
    <section class="profile-card">
      <h2 class="section-header">My Account</h2>

      <div class="form-grid">
        <input
          v-model="user.username"
          placeholder="Username"
          class="form-input"
        />

        <input
          v-model="user.email"
          type="email"
          placeholder="Email"
          class="form-input"
        />

        <button @click="save" class="btn-primary">
          Save Changes
        </button>
      </div>

      <p v-if="msg" class="msg-success">{{ msg }}</p>
    </section>

    <!-- Danger Zone -->
    <section class="profile-card">
      <h2 class="sensitive-header">Sensitive Actions</h2>

      <button
        @click="logout"
        class="btn-outline danger-button"
      >
        Logout
      </button>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref(
  JSON.parse(localStorage.getItem('session') || '{"username":"","email":""}')
)

const msg = ref('')

function save() {
  localStorage.setItem('session', JSON.stringify(user.value))
  msg.value = 'Profile updated successfully.'
  setTimeout(() => (msg.value = ''), 2000)
}

function logout() {
  localStorage.removeItem('session')
  router.push('/login')
}
</script>

<style scoped>
/* ----- WRAPPER ----- */
.profile-wrapper {
  max-width: 45rem;  /* reduced width from 56rem → more compact */
  margin: 0 auto;
  padding: 24px;
}

/* ----- TITLES ----- */
.profile-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827; 
  margin-bottom: 1.5rem;
}

:global(html.dark) {
  .profile-title {
    color: #f9fafb !important;
  }
}

.section-header {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #111827;
}

.sensitive-header {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #d84343;
}

/* dark mode */
:global(html.dark) .section-header {
  color: #f9fafb;
}

.profile-card {
  background: #f0f2f6;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(15,23,42,0.06);
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
}

:global(html.dark) .profile-card {
  background-color: #0f172a;
  border-color: #1e293b;
}

.form-grid {
  display: grid;
  gap: 12px;
}

/* ----- INPUTS ----- */
.form-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  background: #ffffff;
  color: #111827;
}

.form-input:focus {
  outline: none;
  border-color: #ffc814;
  box-shadow: 0 0 0 1px #ffc814;
}

:global(html.dark) .form-input {
  background-color: #020617;
  color: #f9fafb;
  border-color: #4b5563;
}

:global(html.dark) .form-input::placeholder {
  color: #9ca3af;
}

/* ----- PRIMARY BUTTON ----- */
.btn-primary {
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: #ffc814;
  color: #2d3136;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
}

.btn-primary:hover {
  background: #e0ac10;
}

.btn-primary:active {
  transform: translateY(1px);
}

/* ----- OUTLINE BUTTON ----- */
.btn-outline {
  padding: 8px 14px;
  border-radius: 6px;
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #374151;
  cursor: pointer;
}

.btn-outline:hover {
  background: #f3f4f6; 
}

.btn-outline:active {
  transform: translateY(1px);
}

/* Danger button override */
.danger-button {
  border-color: #fca5a5;
  color: #dc2626;
}

.danger-button:hover {
  background: #dc2626;
  color: white;
}

/* ---- SUCCESS MESSAGE ---- */
.msg-success {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #16a34a;
}

/* DARK MODE success message */
:global(html.dark) .msg-success {
  color: #86efac;
}
</style>
