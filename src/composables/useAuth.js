import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const isLoading = ref(false)
  const error = ref('')
  
  const isAuthenticated = computed(() => !!user.value)
  
  const checkAuth = () => {
    const token = localStorage.getItem('access_token')
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    
    if (token && userData) {
      user.value = userData
    } else {
      user.value = null
    }
  }
  
  const login = async (email, password) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      })
      
      const data = await response.json()
      
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      user.value = data.user
      
      router.push('/')
      
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка'
    } finally {
      isLoading.value = false
    }
  }
  
  const register = async (name, email, password) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password})
      })
      
      const data = await response.json()
      
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      user.value = data.user
      
      router.push('/')
      
    } catch (err) {
      error.value = err.message || 'Ошибка'
    } finally {
      isLoading.value = false
    }
  }
  
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({refresh_token: refreshToken})
        })
      }
    } catch (err) {
      console.log(err)
    }
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    
    user.value = null
    
    router.push('/login')
  }
  
  const getCurrentUser = async () => {
    if (!localStorage.getItem('access_token')) return null
    
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      const data = await response.json()
      localStorage.setItem('user', JSON.stringify(data.user))
      user.value = data.user
      return data.user
    } catch (err) {
      console.log(err)
      return null
    }
  }
  
  onMounted(() => {
    if (localStorage.getItem('access_token')) {
      getCurrentUser()
    }
  })
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    getCurrentUser
  }
}