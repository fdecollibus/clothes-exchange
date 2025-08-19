import { create } from 'zustand'
import { itemsApi } from '../lib/api'
import type { Item, PaginatedResponse } from '../types'
import toast from 'react-hot-toast'

interface ItemsState {
  items: Item[]
  total: number
  page: number
  totalPages: number
  isLoading: boolean
  loadItems: (params?: { page?: number; status?: string }) => Promise<void>
  createItem: (data: FormData) => Promise<void>
  updateItem: (id: string, data: Partial<Item>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  duplicateItem: (id: string) => Promise<void>
  downloadList: (type: 'all' | 'sold' | 'unsold') => Promise<void>
  downloadLabels: () => Promise<void>
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,

  loadItems: async (params = {}) => {
    set({ isLoading: true })
    try {
      const response = await itemsApi.getMyItems(params)
      const { data, total, page, totalPages } = response.data.data
      set({ items: data, total, page, totalPages, isLoading: false })
    } catch (error: any) {
      set({ isLoading: false })
      toast.error(error.response?.data?.message || 'Failed to load items')
    }
  },

  createItem: async (data: FormData) => {
    try {
      const response = await itemsApi.createItem(data)
      const newItem = response.data.data
      set((state) => ({ items: [newItem, ...state.items] }))
      toast.success('Item created successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create item')
      throw error
    }
  },

  updateItem: async (id: string, data: Partial<Item>) => {
    try {
      const response = await itemsApi.updateItem(id, data)
      const updatedItem = response.data.data
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updatedItem : item))
      }))
      toast.success('Item updated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update item')
      throw error
    }
  },

  deleteItem: async (id: string) => {
    try {
      await itemsApi.deleteItem(id)
      set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      }))
      toast.success('Item deleted successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete item')
      throw error
    }
  },

  duplicateItem: async (id: string) => {
    try {
      const response = await itemsApi.duplicateItem(id)
      const duplicatedItem = response.data.data
      set((state) => ({ items: [duplicatedItem, ...state.items] }))
      toast.success('Item duplicated successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to duplicate item')
      throw error
    }
  },

  downloadList: async (type: 'all' | 'sold' | 'unsold') => {
    try {
      const response = await itemsApi.downloadList(type)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `items-${type}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download list')
    }
  },

  downloadLabels: async () => {
    try {
      const response = await itemsApi.downloadLabels()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'labels.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Labels download started!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to download labels')
    }
  },
}))