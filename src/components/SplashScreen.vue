<!-- SplashScreen.vue -->
<template>
  <div class="splash-wrapper">
    <img src="@/assets/logo.png" alt="Logo" class="splash-logo animate-glow" />
    <h1 class="splash-title animate-glow">Smart Campus Navigation System</h1>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Fullscreen center container */
.splash-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;        /* STACK VERTICALLY */
  align-items: center;           /* CENTER horizontally */
  justify-content: center;       /* CENTER vertically */
  background: #ffffff;
  z-index: 9999;
}

/* Logo */
.splash-logo {
  width: 160px;         /* adjust size */
  height: 160px;
  border-radius: 32px;
  margin-bottom: 20px;  /* spacing between logo & text */
}

/* Title */
.splash-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #111827;
}

/* Glow animation */
@keyframes glow {
  0%   { text-shadow: 0 0 6px #facc15; filter: brightness(1); }
  50%  { text-shadow: 0 0 14px #facc15; filter: brightness(1.15); }
  100% { text-shadow: 0 0 6px #facc15; filter: brightness(1); }
}

.animate-glow {
  animation: glow 2s infinite ease-in-out;
}
</style>
