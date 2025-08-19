export interface User {
  id: string
  name: string
  email: string
  sellerNumber?: string
  street?: string
  city?: string
  iban?: string
  isAdmin?: boolean
  role?: 'admin' | 'staff' | 'user'
  createdAt: string
  updatedAt: string
}

export interface Item {
  id: string
  itemNumber: string
  title: string
  description: string
  price: number
  size: string
  condition: ItemCondition
  category: ItemCategory
  status: ItemStatus
  imageUrl?: string
  sellerId: string
  seller?: User
  createdAt: string
  updatedAt: string
}

export type ItemCondition = 'new' | 'very_good' | 'good' | 'acceptable'
export type ItemCategory = 'clothing' | 'shoes' | 'toys' | 'accessories'
export type ItemStatus = 'available' | 'sold' | 'reserved'

export interface CartItem extends Item {
  quantity: number
}

export interface Sale {
  id: string
  items: Item[]
  total: number
  createdAt: string
  receiptUrl?: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}