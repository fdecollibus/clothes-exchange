import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  ArrowDownTrayIcon,
  TagIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { useItemsStore } from '../stores/itemsStore'
import { useAuthStore } from '../stores/authStore'
import { formatCurrency } from '../lib/utils'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ItemCard from '../components/items/ItemCard'
import Modal from '../components/ui/Modal'
import ItemForm from '../components/items/ItemForm'
import type { Item } from '../types'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    items, 
    isLoading, 
    loadItems, 
    createItem, 
    updateItem, 
    deleteItem, 
    duplicateItem,
    downloadList,
    downloadLabels 
  } = useItemsStore()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadItems()
  }, [loadItems])

  const stats = {
    total: items.length,
    available: items.filter(item => item.status === 'available').length,
    sold: items.filter(item => item.status === 'sold').length,
    totalValue: items.reduce((sum, item) => sum + item.price, 0),
    soldValue: items.filter(item => item.status === 'sold').reduce((sum, item) => sum + item.price, 0),
  }

  const handleCreateItem = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await createItem(data)
      setIsCreateModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateItem = async (data: FormData) => {
    if (!editingItem) return
    
    setIsSubmitting(true)
    try {
      const updateData: Partial<Item> = {
        title: data.get('title') as string,
        description: data.get('description') as string,
        price: parseFloat(data.get('price') as string),
        size: data.get('size') as string,
        condition: data.get('condition') as any,
        category: data.get('category') as any,
      }
      
      await updateItem(editingItem.id, updateData)
      setEditingItem(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(id)
    }
  }

  const handleDuplicateItem = async (id: string) => {
    await duplicateItem(id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Welcome back, {user?.name}! ✨
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Manage your items, track sales, and grow your business with our beautiful platform.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card glass className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-primary-100 text-primary-600">
              <ShoppingBagIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Items</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card glass className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-success-100 text-success-600">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Available</p>
              <p className="text-2xl font-bold text-slate-900">{stats.available}</p>
            </div>
          </div>
        </Card>

        <Card glass className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-warning-100 text-warning-600">
              <TagIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Sold Items</p>
              <p className="text-2xl font-bold text-slate-900">{stats.sold}</p>
            </div>
          </div>
        </Card>

        <Card glass className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-xl bg-secondary-100 text-secondary-600">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Value</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats.totalValue)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card glass className="p-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Item
          </Button>
          
          <Button variant="secondary" onClick={() => downloadList('all')}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download All Items
          </Button>
          
          <Button variant="secondary" onClick={() => downloadList('sold')}>
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download Sold Items
          </Button>
          
          <Button variant="secondary" onClick={() => downloadLabels()}>
            <TagIcon className="h-5 w-5 mr-2" />
            Download Labels
          </Button>
        </div>
      </Card>

      {/* Items Grid */}
      {items.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBagIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No items yet</h3>
          <p className="text-slate-600 mb-6">Start by adding your first item to the exchange.</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Item
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ItemCard
                item={item}
                onEdit={setEditingItem}
                onDelete={handleDeleteItem}
                onDuplicate={handleDuplicateItem}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Item Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="lg"
      >
        <ItemForm
          onSubmit={handleCreateItem}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        size="lg"
      >
        {editingItem && (
          <ItemForm
            item={editingItem}
            onSubmit={handleUpdateItem}
            onCancel={() => setEditingItem(null)}
            isLoading={isSubmitting}
          />
        )}
      </Modal>
    </div>
  )
}

export default Dashboard