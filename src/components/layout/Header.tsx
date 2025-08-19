import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UserIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/Button'

export function Header() {
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuthStore()

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'My Items', href: '/items', icon: ShoppingBagIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ]

  if (user?.isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Cog6ToothIcon })
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">KC</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              KidsClothes
            </span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  Hello, {user?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}