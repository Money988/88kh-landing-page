const TOKEN_KEY = 'bo_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)
export const isLoggedIn = () => Boolean(getToken())

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const api = async <T = unknown>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> => {
  const res = await fetch(path, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  if (res.status === 401 && path !== '/api/auth/login') {
    clearToken()
    window.location.href = '/admin/login'
    throw new ApiError(401, 'Unauthorized')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string }).error || res.statusText)
  return data as T
}

export const login = async (password: string) => {
  const { token } = await api<{ token: string }>('/api/auth/login', {
    method: 'POST',
    body: { password },
  })
  setToken(token)
}
