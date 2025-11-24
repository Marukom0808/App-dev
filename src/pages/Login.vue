<!-- Login.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import api from "../services/api";

const username = ref('');
const password = ref('');
const error = ref('');

const router = useRouter();

async function login() {
  error.value = '';

  if (!username.value.trim() || !password.value.trim()) {
    error.value = 'Please enter username and password';
    return;
  }

  try {
  
    const res = await api.post("/login", {
      username: username.value,
      password: password.value
    });

    localStorage.setItem("session", JSON.stringify(res.data.user));
    window.dispatchEvent(new Event('session-updated'));

    router.push('/');
  } catch (err) {
    
    if (err.response?.data?.error) {
      error.value = err.response.data.error;
    } else {
      error.value = "Unable to connect to server. Start backend.";
    }
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">Welcome Back!</h1>

      <div class="login-grid">
        <input
          v-model="username"
          type="text"
          placeholder="Username or Email"
          class="login-input"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="login-input"
        />

        <button
          @click="login"
          class="login-button"
        >
          Login
        </button>

        <RouterLink
          to="/signup"
          class="signup-link"
        >
          Don’t have an account? Sign up
        </RouterLink>

        <p
          v-if="error"
          class="error-text"
        >
          {{ error }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  background: #ffffff;
}

.login-title {
  margin-bottom: 24px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffc814; 
}

.login-grid {
  display: grid;
  gap: 16px;
}

.login-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #babab8;
  font-size: 0.95rem;
  color: #2d3136;
}

.login-input:focus {
  outline: none;
  border-color: #ffc814;              
  box-shadow: 0 0 0 1px #ffc814;      
}

.login-button {
  padding: 10px 12px;
  border-radius: 9999px;
  border: none;
  background: #ffc814;                
  color: #2d3136;                     
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
}

.login-button:hover {
  background: #e0ac10;                
  box-shadow: 0 6px 14px rgba(255, 200, 20, 0.4);
}

.login-button:active {
  transform: translateY(1px);
  box-shadow: 0 3px 8px rgba(255, 200, 20, 0.5);
}

.signup-link {
  text-align: center;
  font-size: 0.85rem;
  color: #b45309;                      
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.error-text {
  text-align: center;
  font-size: 0.85rem;
  color: #ef4444;
}

</style>