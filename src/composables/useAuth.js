import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// Вспомогательная функция для безопасного получения данных из localStorage
function getSafeLocalStorage(key) {
  try {
    const item = localStorage.getItem(key)
    if (item && item !== 'undefined') {
      return JSON.parse(item)
    }
  } catch (e) {
    console.error(`Failed to parse ${key} from localStorage:`, e)
  }
  return null
}

export function useAuth() {
  const router = useRouter()

  const user = ref(getSafeLocalStorage('user'))
  const isLoading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!user.value)

  const login = async (email, password) => {
    isLoading.value = true
    error.value = ''

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))

        user.value = data.user

        router.push('/')
      } else {
        error.value = data.error || 'Ошибка входа'
      }
    } catch (err) {
      error.value = err.message || 'Ошибка соединения'
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        localStorage.setItem('user', JSON.stringify(data.user))

        user.value = data.user

        router.push('/')
      } else {
        error.value = data.error || 'Ошибка регистрации'
      }
    } catch (err) {
      error.value = err.message || 'Ошибка соединения'
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
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
    const token = localStorage.getItem('access_token')
    if (!token) {
      return null
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('user', JSON.stringify(data.user))
        user.value = data.user
        return data.user
      } else {
        // Если запрос не удался, очищаем хранилище
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        user.value = null
        return null
      }
    } catch (err) {
      console.log(err)
      return null
    }
  }

  onMounted(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
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
    getCurrentUser,
  }
}
