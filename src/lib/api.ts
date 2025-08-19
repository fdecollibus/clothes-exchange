import axios from 'axios'
import type { User, Item, Sale, ApiResponse, PaginatedResponse } from '../types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', { email, password }),
  
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data),
  
  me: () => api.get<ApiResponse<User>>('/auth/me'),
  
  updateProfile: (data: Partial<User>) =>
    api.patch<ApiResponse<User>>('/auth/profile', data),
}

// Items API
export const itemsApi = {
  getMyItems: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<ApiResponse<PaginatedResponse<Item>>>('/items/my-items', { params }),
  
  createItem: (data: FormData) =>
    api.post<ApiResponse<Item>>('/items', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  updateItem: (id: string, data: Partial<Item>) =>
    api.patch<ApiResponse<Item>>(`/items/${id}`, data),
  
  deleteItem: (id: string) =>
    api.delete<ApiResponse<void>>(`/items/${id}`),
  
  duplicateItem: (id: string) =>
    api.post<ApiResponse<Item>>(`/items/${id}/duplicate`),
  
  downloadList: (type: 'all' | 'sold' | 'unsold') =>
    api.get(`/items/my-items/download/${type}`, { responseType: 'blob' }),
  
  downloadLabels: () =>
    api.get('/items/my-items/labels', { responseType: 'blob' }),
}

// Admin API
export const adminApi = {
  getSellers: () => api.get<ApiResponse<User[]>>('/admin/sellers'),
  
  getSellerItems: (sellerId: string) =>
    api.get<ApiResponse<Item[]>>(`/admin/sellers/${sellerId}/items`),
  
  getConsolidatedItems: () =>
    api.get<ApiResponse<{ seller: User; items: Item[] }[]>>('/admin/items/consolidated'),
  
  updateItem: (id: string, data: Partial<Item>) =>
    api.patch<ApiResponse<Item>>(`/admin/items/${id}`, data),
  
  deleteItem: (id: string) =>
    api.delete<ApiResponse<void>>(`/admin/items/${id}`),
}

// Checkout API
export const checkoutApi = {
  getSellers: () => api.get<ApiResponse<User[]>>('/checkout/sellers'),
  
  getSellerItems: (sellerId: string) =>
    api.get<ApiResponse<Item[]>>(`/checkout/sellers/${sellerId}/items`),
  
  addToCart: (sellerId: string, itemId: string) =>
    api.post<ApiResponse<Item>>('/checkout/items', { sellerId, itemId }),
  
  processCheckout: (itemIds: string[]) =>
    api.post<ApiResponse<Sale>>('/checkout/process', { items: itemIds }),
  
  downloadReceipt: (itemIds: string[]) =>
    api.get('/checkout/receipt', {
      params: { items: itemIds.join(',') },
      responseType: 'blob',
    }),
}

export default api