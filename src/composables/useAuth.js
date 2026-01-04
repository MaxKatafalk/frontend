import apiClient from '@/api/client'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
const router = useRouter()

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const isLoading = ref(false)
const error = ref('')

const isAuthenticated = computed(() => !!user.value)

const login = async (email, password) => {
	isLoading.value = true
	error.value = ''
	
	try {
		const response = await apiClient.post('/auth/login', {
		email,
		password
		})
		
		const { access_token, refresh_token, user: userData } = response.data
		
		localStorage.setItem('access_token', access_token)
		localStorage.setItem('refresh_token', refresh_token)
		localStorage.setItem('user', JSON.stringify(userData))

		user.value = userData
		
		router.push('/')
		
		return { success: true }
	} catch (err) {
		error.value = err.response?.data?.error || 'Ошибка входа'
		return { success: false, error: error.value }
	} finally {
		isLoading.value = false
	}
}

const register = async (name, email, password) => {
	isLoading.value = true
	error.value = ''
	
	try {
		const response = await apiClient.post('/auth/register', {
		name,
		email,
		password
		})
		
		const { access_token, refresh_token, user: userData } = response.data
		
		localStorage.setItem('access_token', access_token)
		localStorage.setItem('refresh_token', refresh_token)
		localStorage.setItem('user', JSON.stringify(userData))
		
		user.value = userData
		
		router.push('/')
		
		return { success: true }
	} catch (err) {
		error.value = err.response?.data?.error || 'Ошибка регистрации'
		return { success: false, error: error.value }
	} finally {
		isLoading.value = false
	}
}

const logout = async () => {
	try {
		const refreshToken = localStorage.getItem('refresh_token')
		if (refreshToken) {
		await apiClient.post('/auth/logout', { refresh_token: refreshToken })
		}
	} catch (err) {
		console.error('Ошибка при выходе:', err)
	} finally {
		localStorage.removeItem('access_token')
		localStorage.removeItem('refresh_token')
		localStorage.removeItem('user')
		
		user.value = null

		router.push('/login')
	}
}

const getCurrentUser = async () => {
	if (!localStorage.getItem('access_token')) {
		return null
	}
	
	try {
		const response = await apiClient.get('/auth/me')
		const userData = response.data.user
		localStorage.setItem('user', JSON.stringify(userData))
		user.value = userData
		return userData
	} catch (err) {
		console.error('Ошибка получения пользователя:', err)
		return null
	}
}

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