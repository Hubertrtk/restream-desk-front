import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const getBaseURL = () => {
  //   return 'https://waftool-plc-01-b6f8g8e2fffwfjfp.polandcentral-01.azurewebsites.net'
  return 'http://localhost:80'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor requestu
api.interceptors.request.use((config) => {
  const sessionStore = useAuthStore()

  if (sessionStore.sessionId) {
    console.log('sessionStore.sessionId')
    console.log(sessionStore.sessionId)
    if (config.method) {
      config.data = {
        ...(config.data || {}),
        _sessid: sessionStore.sessionId,
      }
    }

    // 👉 alternatywnie do nagłówka
    // config.headers['X-Session-Id'] = sessionStore.sessionId
  }

  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
)

export default api
