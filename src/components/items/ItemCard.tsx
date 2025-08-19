import React from 'react'
import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  EyeIcon,
  TagIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import type { Item } from '../../types'
import { formatPrice, formatDate } from '../../lib/utils'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useItemsStore } from '../../stores/itemsStore'

interface ItemCardProps {
  item: Item
  onView?: (item: Item) => void
}

export function ItemCard({ item, onView }: ItemCardProps) {
  const { addToCart } = useItemsStore()
  const [isFavorite, setIsFavorite] = React.useState(false)

  const conditionColors = {
    new: 'bg-green-100 text-green-800',
    very_good: 'bg-blue-100 text-blue-800',
    good: 'bg-yellow-100 text-yellow-800',
    acceptable: 'bg-gray-100 text-gray-800',
  }

  const conditionLabels = {
    new: 'Neu',
    very_good: 'Sehr gut',
    good: 'Gut',
    acceptable: 'Akzeptabel',
  }

  const categoryLabels = {
    clothing: 'Kleidung',
    shoes: 'Schuhe',
    toys: 'Spielzeug',
    accessories: 'Accessoires',
  }

  return (
    <Card hover className="group">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={item.imageUrl || 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="absolute top-3 right-3 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </motion.button>
        </div>

        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[item.condition]}`}>
            {conditionLabels[item.condition]}
          </span>
        </div>

        {item.status === 'sold' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-medium">
              Verkauft
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
          <span className="text-lg font-bold text-primary-600 ml-2">
            {formatPrice(item.price)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <TagIcon className="h-3 w-3 mr-1" />
              {categoryLabels[item.category]}
            </span>
            <span>Größe {item.size}</span>
          </div>
          <span className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {formatDate(item.createdAt)}
          </span>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(item)}
            className="flex-1"
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Details
          </Button>
          {item.status === 'available' && (
            <Button
              size="sm"
              onClick={() => addToCart(item)}
              className="flex-1"
            >
              <ShoppingCartIcon className="h-4 w-4 mr-1" />
              In den Warenkorb
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}