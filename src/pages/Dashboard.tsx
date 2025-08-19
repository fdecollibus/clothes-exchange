import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  PlusIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  TrophyIcon 
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../stores/authStore'
import { useItemsStore } from '../stores/itemsStore'
import { formatPrice } from '../lib/utils'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ItemCard } from '../components/items/ItemCard'

export function Dashboard() {
  const { user } = useAuthStore()
  const { items, fetchItems } = useItemsStore()

  React.useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const userItems = items.filter(item => item.sellerId === user?.id)
  const availableItems = userItems.filter(item => item.status === 'available')
  const soldItems = userItems.filter(item => item.status === 'sold')
  const totalValue = userItems.reduce((sum, item) => sum + item.price, 0)
  const soldValue = soldItems.reduce((sum, item) => sum + item.price, 0)

  const stats = [
    {
      name: 'Artikel insgesamt',
      value: userItems.length,
      icon: ShoppingBagIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Verfügbare Artikel',
      value: availableItems.length,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Verkaufte Artikel',
      value: soldItems.length,
      icon: TrophyIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Gesamtwert',
      value: formatPrice(totalValue),
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Willkommen zurück, {user?.name}! 👋
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Verwalten Sie Ihre Kinderkleidung und erzielen Sie tolle Verkäufe
        </p>
        <Link to="/items/new">
          <Button size="lg" className="shadow-xl">
            <PlusIcon className="h-5 w-5 mr-2" />
            Neuen Artikel hinzufügen
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Items */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Ihre neuesten Artikel</h2>
          <Link to="/items">
            <Button variant="outline">Alle anzeigen</Button>
          </Link>
        </div>

        {userItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBagIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Noch keine Artikel
            </h3>
            <p className="text-gray-600 mb-6">
              Fügen Sie Ihren ersten Artikel hinzu und beginnen Sie mit dem Verkauf!
            </p>
            <Link to="/items/new">
              <Button>
                <PlusIcon className="h-5 w-5 mr-2" />
                Ersten Artikel hinzufügen
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userItems.slice(0, 8).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Schnellaktionen</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/items/new">
            <Button variant="outline" className="w-full justify-start">
              <PlusIcon className="h-5 w-5 mr-2" />
              Artikel hinzufügen
            </Button>
          </Link>
          <Link to="/items">
            <Button variant="outline" className="w-full justify-start">
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Artikel verwalten
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="w-full justify-start">
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              Verkaufsstatistiken
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}