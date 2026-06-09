import axios from 'axios'

const api = axios.create({
  baseURL: 'https://cautious-space-dollop-6447jx4x47xf546j-3001.app.github.dev/api'
})

// Agrega el token automáticamente a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api