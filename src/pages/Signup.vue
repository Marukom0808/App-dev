<!-- Signup.vue -->
<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import api from "../services/api";

const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');

const router = useRouter();

async function signup() {
  error.value = "";
  console.log("🟡 Starting signup..."); // ADD THIS LINE

  // Basic validation
  if (!username.value.trim() || !email.value.trim() || !password.value.trim()) {
    error.value = "Please fill out all fields";
    return;
  }

  try {
    console.log("🟡 Sending request to backend..."); // ADD THIS LINE
    const res = await api.post("/signup", { 
      username: username.value, 
      email: email.value, 
      password: password.value 
    });
    
    console.log("✅ Signup successful:", res.data); // ADD THIS LINE
    success.value = "Account created!";
    router.push("/login");
  } catch (err) {
    console.error("❌ Signup error:", err); // ADD THIS LINE
    error.value = err.response?.data?.error || "Unable to connect to server.";
  }
}
</script>

<template>
  <div class="signup-page">
    <div class="signup-card">
      <h1 class="signup-title">
        Create an Account
      </h1>

      <div class="signup-grid">
        <input
          v-model="username"
          placeholder="Username"
          class="signup-input"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="signup-input"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="signup-input"
        />

        <button
          @click="signup"
          class="signup-button"
        >
          Sign Up
        </button>

        <RouterLink
          to="/login"
          class="signup-link"
        >
          Already have an account? Log in
        </RouterLink>

        <p
          v-if="error"
          class="error-text"
        >
          {{ error }}
        </p>

        <p
          v-if="success"
          class="success-text"
        >
          {{ success }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.signup-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  background: #ffffff;
}

.signup-title {
  margin-bottom: 24px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffc814;
}

.signup-grid {
  display: grid;
  gap: 16px;
}

.signup-input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #babab8;
  font-size: 0.95rem;
  color: #2d3136;

}

.signup-input:focus {
  outline: none;
  border-color: #ffc814;
  box-shadow: 0 0 0 1px #ffc814;
}

.signup-button {
  padding: 10px 12px;
  border-radius: 9999px;
  border: none;
  background: #ffc814;
  color: #2d3136;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
}

.signup-button:hover {
  background: #e0ac10;
  box-shadow: 0 6px 14px rgba(255, 200, 20, 0.4);
}

.signup-button:active {
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

.success-text {
  text-align: center;
  font-size: 0.85rem;
  color: #16a34a;
}
</style>
