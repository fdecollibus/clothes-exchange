import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
}

// Mock data for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true,
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Maria Müller',
    email: 'maria@example.com',
    sellerNumber: 'S001',
    street: 'Bahnhofstrasse 123',
    city: '8001 Zürich',
    iban: 'CH93 0076 2011 6238 5295 7',
    role: 'seller',
    createdAt: new Date().toISOString(),
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const user = mockUsers.find(u => u.email === email)
        if (user && password === 'password') {
          set({ user, isAuthenticated: true, isLoading: false })
        } else {
          set({ isLoading: false })
          throw new Error('Invalid credentials')
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role: 'seller',
          createdAt: new Date().toISOString(),
        }
        
        mockUsers.push(newUser)
        set({ user: newUser, isAuthenticated: true, isLoading: false })
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: async (data: Partial<User>) => {
        const { user } = get()
        if (!user) throw new Error('Not authenticated')
        
        set({ isLoading: true })
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const updatedUser = { ...user, ...data }
        set({ user: updatedUser, isLoading: false })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)