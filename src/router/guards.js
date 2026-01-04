export function requireAuth(to, from, next) {
  const token = localStorage.getItem('access_token')

  if (!token) {
    next('/login')
  } else {
    next()
  }
}

export function requireGuest(to, from, next) {
  const token = localStorage.getItem('access_token')

  if (token) {
    next('/')
  } else {
    next()
  }
}
