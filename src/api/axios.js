import axios from 'axios'

const getBaseURL = () => {
  //   return 'https://waftool-plc-01-b6f8g8e2fffwfjfp.polandcentral-01.azurewebsites.net'
  return 'http://10.0.11.208/restreamdesk'
}

const getAuth = () => {
  let auth = localStorage.getItem('wtauthuser')
  const { userName, password } = JSON.parse(auth)
  if (userName && password) {
    const raw = `${userName}:${password}`
    const encoded = btoa(raw) // base64 encode
    return `Basic ${encoded}`
  }

  return null
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor do dynamicznego ustawiania baseURL przed każdym requestem
api.interceptors.request.use((config) => {
  config.baseURL = getBaseURL()

  // Dodanie nagłówka Authorization do każdego requestu, jeśli dane uwierzytelniające są w localStorage
  const auth = getAuth()
  if (auth) {
    config.headers['Authorization'] = auth
  }

  return config
})

api.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    if (error) {
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

export default api
