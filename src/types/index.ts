export interface User {
  id: string
  name: string
  email: string
  sellerNumber?: string
  street?: string
  city?: string
  iban?: string
  isAdmin?: boolean
  role?: 'admin' | 'seller' | 'customer'
  createdAt: string
}

export interface Item {
  id: string
  sellerId: string
  itemNumber: number
  title: string
  description: string
  price: number
  size: string
  condition: 'new' | 'very_good' | 'good' | 'acceptable'
  category: 'clothing' | 'shoes' | 'toys' | 'accessories'
  status: 'available' | 'sold' | 'reserved'
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface Seller {
  id: string
  name: string
  sellerNumber: string
  email: string
  street?: string
  city?: string
  iban?: string
  itemCount: number
  totalValue: number
  items: Item[]
}

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

export type ViewMode = 'grid' | 'list'
export type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'name'