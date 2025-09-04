// src/stores/configStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    sessionId: localStorage.getItem('rdauthuserSessionId') || null,
  }),
  actions: {
    setSessionId(id) {
      this.sessionId = id
      localStorage.setItem('rdauthuserSessionId', id)
    },
  },
})
