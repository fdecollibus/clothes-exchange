import React from 'react'
import { motion } from 'framer-motion'
import { 
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  TagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import type { Item } from '../../types'
import { formatCurrency } from '../../lib/utils'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete, onDuplicate }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-success-100 text-success-800 border-success-200'
      case 'sold':
        return 'bg-slate-100 text-slate-800 border-slate-200'
      case 'reserved':
        return 'bg-warning-100 text-warning-800 border-warning-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getConditionLabel = (condition: string) => {
    const labels = {
      new: 'New',
      very_good: 'Very Good',
      good: 'Good',
      acceptable: 'Acceptable'
    }
    return labels[condition as keyof typeof labels] || condition
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      clothing: 'Clothing',
      shoes: 'Shoes',
      toys: 'Toys',
      accessories: 'Accessories'
    }
    return labels[category as keyof typeof labels] || category
  }

  return (
    <Card hover className="overflow-hidden">
      <div className="relative">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <TagIcon className="h-12 w-12 text-slate-400" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>
        
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-slate-700 border border-white/20 backdrop-blur-sm">
            #{item.itemNumber}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
          <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-slate-500">Category:</span>
            <p className="font-medium text-slate-900">{getCategoryLabel(item.category)}</p>
          </div>
          <div>
            <span className="text-slate-500">Size:</span>
            <p className="font-medium text-slate-900">{item.size}</p>
          </div>
          <div>
            <span className="text-slate-500">Condition:</span>
            <p className="font-medium text-slate-900">{getConditionLabel(item.condition)}</p>
          </div>
          <div>
            <span className="text-slate-500">Price:</span>
            <p className="font-semibold text-primary-600 flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-1" />
              {formatCurrency(item.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              disabled={item.status === 'sold'}
              className="p-2"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(item.id)}
              className="p-2"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              disabled={item.status === 'sold'}
              className="p-2 text-error-600 hover:text-error-700 hover:bg-error-50"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <span className="text-xs text-slate-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default ItemCard