import { create } from 'zustand'
import api from '../utils/api'

interface AuthState {
  isAuthenticated: boolean
  user: {
    id: string
    email: string
    isAdmin: boolean
  } | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })
      
      const { user, token } = response.data
      
      if (!user.isAdmin) {
        throw new Error('Unauthorized: Admin access only')
      }

      // Store the token in localStorage
      localStorage.setItem('token', token)
      
      set({ isAuthenticated: true, user })
    } catch (error: any) {
      console.error('Login failed:', error)
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      throw new Error('Login failed. Please try again.')
    }
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ isAuthenticated: false, user: null })
  },
  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isAuthenticated: false, user: null })
      return
    }
    
    try {
      const response = await api.get('/auth/me')
      if (response.data && response.data.isAdmin) {
        set({ isAuthenticated: true, user: response.data })
      } else {
        localStorage.removeItem('token')
        set({ isAuthenticated: false, user: null })
      }
    } catch (error) {
      localStorage.removeItem('token')
      set({ isAuthenticated: false, user: null })
    }
  }
})) 