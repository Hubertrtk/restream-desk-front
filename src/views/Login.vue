<template>
  <section class="page">
    <div class="card">
      <header class="card__header">
        <h1>Logowanie</h1>
        <p class="subtitle">Podaj swoje dane, aby się zalogować.</p>
      </header>

      <form class="form" @submit.prevent="onSubmit">
        <div class="field">
          <label for="username">Nazwa użytkownika</label>
          <input
            id="username"
            v-model.trim="userName"
            type="text"
            placeholder="Wpisz login"
            required
          />
        </div>

        <div class="field">
          <label for="password">Hasło</label>
          <input
            id="password"
            v-model.trim="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="actions">
          <button type="submit" class="btn">Zaloguj się</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { login } from '@/api/serviceApi'
import buildSessionString from '@/helpers/buildSessionCookie'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const userName = ref('')
const password = ref('')
const authStore = useAuthStore()

function onSubmit() {
  const payload = {
    email: userName.value,
    password: password.value,
  }
  //   localStorage.setItem('rdauthuser', JSON.stringify(payload))
  //   userName.value = ''
  //   password.value = ''
  login(payload)
    .then((res) => {
      console.log(res.data)
      if (res.data.session) {
        authStore.setSessionId(buildSessionString(res.data.session))
      } else {
        // alert('Błędny login lub hasło')
      }
    })
    .catch((err) => {
      console.error('err', err)
      //   alert('Błędny login lub hasło')
    })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 16px;
  background: linear-gradient(160deg, #0f172a 0%, #111827 60%, #0b1220 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.card {
  width: min(100%, 420px);
  background: #0b1020;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 24px;
  color: #f1f5f9;
}

h1 {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
}
.subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 20px;
}

.form {
  display: grid;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
label {
  font-size: 14px;
  color: #e2e8f0;
}

input[type='text'],
input[type='password'] {
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

input:focus {
  border-color: #7dd3fc;
  box-shadow: 0 0 0 4px rgba(125, 211, 252, 0.15);
  background: #0b1220;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.btn {
  cursor: pointer;
  border: none;
  background: linear-gradient(180deg, #60a5fa, #38bdf8);
  color: #0b1220;
  padding: 12px 16px;
  font-weight: 700;
  border-radius: 12px;
  transition:
    filter 0.15s ease,
    transform 0.08s ease;
  width: 100%;
}
.btn:hover {
  filter: brightness(1.05);
}
.btn:active {
  transform: translateY(1px);
}

/* Responsive */
@media (max-width: 480px) {
  .card {
    padding: 16px;
  }
}
</style>
