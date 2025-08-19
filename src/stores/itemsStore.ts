import { create } from 'zustand'
import type { Item, Seller, CartItem, Sale, SortOption } from '../types'
import { generateId } from '../lib/utils'

interface ItemsState {
  items: Item[]
  sellers: Seller[]
  cart: CartItem[]
  sales: Sale[]
  isLoading: boolean
  searchQuery: string
  selectedCategory: string
  sortBy: SortOption
  
  // Actions
  fetchItems: () => Promise<void>
  fetchSellers: () => Promise<void>
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  addToCart: (item: Item) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  processCheckout: () => Promise<Sale>
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  setSortBy: (sort: SortOption) => void
}

// Mock data
const mockItems: Item[] = [
  {
    id: '1',
    sellerId: '2',
    itemNumber: 1,
    title: 'Rosa Sommerkleid',
    description: 'Wunderschönes rosa Sommerkleid für Mädchen, kaum getragen',
    price: 15.50,
    size: '98',
    condition: 'very_good',
    category: 'clothing',
    status: 'available',
    imageUrl: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    sellerId: '2',
    itemNumber: 2,
    title: 'Blaue Jeans',
    description: 'Robuste Jeans für Jungen, perfekt für den Alltag',
    price: 12.00,
    size: '104',
    condition: 'good',
    category: 'clothing',
    status: 'available',
    imageUrl: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    sellerId: '2',
    itemNumber: 3,
    title: 'Rote Turnschuhe',
    description: 'Sportliche Turnschuhe in leuchtendem Rot',
    price: 20.00,
    size: '28',
    condition: 'very_good',
    category: 'shoes',
    status: 'available',
    imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    sellerId: '2',
    itemNumber: 4,
    title: 'Holzpuzzle',
    description: 'Pädagogisches Holzpuzzle für Kleinkinder',
    price: 8.50,
    size: 'One Size',
    condition: 'good',
    category: 'toys',
    status: 'sold',
    imageUrl: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: mockItems,
  sellers: [],
  cart: [],
  sales: [],
  isLoading: false,
  searchQuery: '',
  selectedCategory: '',
  sortBy: 'newest',

  fetchItems: async () => {
    set({ isLoading: true })
    await new Promise(resolve => setTimeout(resolve, 500))
    set({ isLoading: false })
  },

  fetchSellers: async () => {
    set({ isLoading: true })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const { items } = get()
    const sellersMap = new Map<string, Seller>()
    
    items.forEach(item => {
      if (!sellersMap.has(item.sellerId)) {
        sellersMap.set(item.sellerId, {
          id: item.sellerId,
          name: 'Maria Müller',
          sellerNumber: 'S001',
          email: 'maria@example.com',
          street: 'Bahnhofstrasse 123',
          city: '8001 Zürich',
          iban: 'CH93 0076 2011 6238 5295 7',
          itemCount: 0,
          totalValue: 0,
          items: [],
        })
      }
      
      const seller = sellersMap.get(item.sellerId)!
      seller.items.push(item)
      seller.itemCount++
      seller.totalValue += item.price
    })
    
    set({ sellers: Array.from(sellersMap.values()), isLoading: false })
  },

  addItem: async (itemData) => {
    set({ isLoading: true })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newItem: Item = {
      ...itemData,
      id: generateId(),
      itemNumber: get().items.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    set(state => ({
      items: [...state.items, newItem],
      isLoading: false,
    }))
  },

  updateItem: async (id, updates) => {
    set({ isLoading: true })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    set(state => ({
      items: state.items.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      ),
      isLoading: false,
    }))
  },

  deleteItem: async (id) => {
    set({ isLoading: true })
    await new Promise(resolve => setTimeout(resolve, 500))
    
    set(state => ({
      items: state.items.filter(item => item.id !== id),
      isLoading: false,
    }))
  },

  addToCart: (item) => {
    set(state => {
      const existingItem = state.cart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return {
          cart: state.cart.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        }
      }
      return {
        cart: [...state.cart, { ...item, quantity: 1 }],
      }
    })
  },

  removeFromCart: (itemId) => {
    set(state => ({
      cart: state.cart.filter(item => item.id !== itemId),
    }))
  },

  clearCart: () => {
    set({ cart: [] })
  },

  processCheckout: async () => {
    const { cart } = get()
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    
    const sale: Sale = {
      id: generateId(),
      items: cart.map(({ quantity, ...item }) => item),
      total,
      createdAt: new Date().toISOString(),
    }
    
    // Mark items as sold
    set(state => ({
      items: state.items.map(item =>
        cart.some(cartItem => cartItem.id === item.id)
          ? { ...item, status: 'sold' as const }
          : item
      ),
      sales: [...state.sales, sale],
      cart: [],
    }))
    
    return sale
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSortBy: (sort) => set({ sortBy: sort }),
}))