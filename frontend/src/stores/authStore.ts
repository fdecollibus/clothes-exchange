import { create } from 'zustand';
import api from '../utils/axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  sellerNumber?: string;
  street?: string;
  city?: string;
  iban?: string;
  isAdmin?: boolean;
  role?: 'admin' | 'staff' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/api/auth/me');
      set({ user: response.data, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      await api.post('/api/auth/register', { name, email, password });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
})); 