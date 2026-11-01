export class ApiError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// Auth is an httpOnly cookie set by the server; JS never sees the JWT.
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(data.error || 'Something went wrong', res.status, data.errors)
  return data
}

export const fetchHealth = () => request('/health')
export const signup = (payload) => request('/auth/signup', { method: 'POST', body: payload })
export const login = (payload) => request('/auth/login', { method: 'POST', body: payload })
export const logout = () => request('/auth/logout', { method: 'POST' })
export const fetchMe = () => request('/auth/me')

export const fetchPosts = () => request('/posts')
export const fetchPost = (id) => request(`/posts/${id}`)
export const createPost = (payload) => request('/posts', { method: 'POST', body: payload })
export const deletePost = (id) => request(`/posts/${id}`, { method: 'DELETE' })

export const likePost = (id) => request(`/posts/${id}/like`, { method: 'POST' })
export const unlikePost = (id) => request(`/posts/${id}/like`, { method: 'DELETE' })
export const fetchComments = (id) => request(`/posts/${id}/comments`)
export const addComment = (id, content) => request(`/posts/${id}/comments`, { method: 'POST', body: { content } })
export const deleteComment = (id) => request(`/comments/${id}`, { method: 'DELETE' })
