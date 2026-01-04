export function isTokenValid(token) {
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function getTokenData(token) {
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

export function needsRefresh(token) {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 - Date.now() < 5 * 60 * 1000
  } catch {
    return true
  }
}
