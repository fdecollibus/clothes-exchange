import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../lib/api'
import type { User } from '../types'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loadUser: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authApi.login(email, password)
          const { user, token } = response.data.data
          
          localStorage.setItem('auth-token', token)
          set({ user, token, isAuthenticated: true, isLoading: false })
          toast.success(`Welcome back, ${user.name}!`)
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || 'Login failed')
          throw error
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await authApi.register({ name, email, password })
          const { user, token } = response.data.data
          
          localStorage.setItem('auth-token', token)
          set({ user, token, isAuthenticated: true, isLoading: false })
          toast.success(`Welcome to Clothes Exchange, ${user.name}!`)
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || 'Registration failed')
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('auth-token')
        set({ user: null, token: null, isAuthenticated: false })
        toast.success('Logged out successfully')
      },

      loadUser: async () => {
        const token = localStorage.getItem('auth-token')
        if (!token) return

        set({ isLoading: true })
        try {
          const response = await authApi.me()
          set({ user: response.data.data, token, isAuthenticated: true, isLoading: false })
        } catch (error) {
          localStorage.removeItem('auth-token')
          set({ user: null, token: null, isAuthenticated: false, isLoading: false })
        }
      },

      updateProfile: async (data: Partial<User>) => {
        try {
          const response = await authApi.updateProfile(data)
          set({ user: response.data.data })
          toast.success('Profile updated successfully')
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to update profile')
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)