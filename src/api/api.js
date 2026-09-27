const API_BASE_URL = import.meta.env.VITE_API_URL

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('changemakers_token')

  const headers = {
    ...(options.headers || {})
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const isFormData = options.body instanceof FormData

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
  ...options,
  headers,
  cache: 'no-store'
})

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export const apiGet = (endpoint) => request(endpoint)

export const apiPost = (endpoint, body) =>
  request(endpoint, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body)
  })

export const apiPatch = (endpoint, body) =>
  request(endpoint, {
    method: 'PATCH',
    body: body instanceof FormData ? body : JSON.stringify(body)
  })

export const apiDelete = (endpoint) =>
  request(endpoint, {
    method: 'DELETE'
  })